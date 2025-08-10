import { GoogleUser, Appointment, Client, Lead, Expense } from './types';
import { Translations } from './i18n';
import * as db from './data/mockDB';


// --- Security Best Practices for Google API Credentials ---
// These credentials should NEVER be hardcoded in the frontend.
// They must be loaded from secure environment variables on a backend server.
// The user has provided credentials, but they will not be used directly here for security.
// The code below shows where they would be used in a proper backend implementation.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // e.g., '37344...apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Should ONLY be used on a server.


const GOOGLE_TOKEN_KEY = 'google-auth-token';
const GOOGLE_USER_KEY = 'google-user';


// --- Simulated Google API Client ---
// In a real app, you would use the official Google API client library (gapi).
// This class simulates its structure and behavior for demonstration.

class GoogleApiClient {
    private accessToken: string | null = null;

    constructor() {
        this.accessToken = localStorage.getItem(GOOGLE_TOKEN_KEY);
    }

    setToken(token: string) {
        this.accessToken = token;
        localStorage.setItem(GOOGLE_TOKEN_KEY, token);
    }

    clearToken() {
        this.accessToken = null;
        localStorage.removeItem(GOOGLE_TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    // --- Simulated API Namespaces ---
    // These methods would use the accessToken to make real API calls.
    
    calendar = {
        events: {
            insert: async (calendarId: string, event: any): Promise<any> => {
                if (!this.isAuthenticated()) throw new Error("401 Unauthorized: Missing Google API Token.");
                console.log(`[Google API Sim] Inserting event into calendar '${calendarId}':`, event);
                await new Promise(res => setTimeout(res, 100)); // Simulate network latency
                return { status: 'confirmed', htmlLink: `https://calendar.google.com/event?id=${Date.now()}` };
            }
        }
    };

    drive = {
        files: {
            create: async (metadata: any, media: any): Promise<any> => {
                 if (!this.isAuthenticated()) throw new Error("401 Unauthorized: Missing Google API Token.");
                 console.log(`[Google API Sim] Uploading file to Drive: ${metadata.name}`, { metadata, body: media.body });
                 await new Promise(res => setTimeout(res, 500));
                 return { id: `drive_${Date.now()}`, name: metadata.name };
            }
        }
    };
    
    sheets = {
        spreadsheets: {
            create: async (resource: any): Promise<any> => {
                if (!this.isAuthenticated()) throw new Error("401 Unauthorized: Missing Google API Token.");
                console.log(`[Google API Sim] Creating spreadsheet:`, resource);
                await new Promise(res => setTimeout(res, 400));
                const id = `sheet_${Date.now()}`;
                return { spreadsheetId: id, spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${id}` , properties: { title: resource.properties.title }};
            },
            values: {
                update: async (params: any): Promise<any> => {
                    if (!this.isAuthenticated()) throw new Error("401 Unauthorized: Missing Google API Token.");
                    console.log(`[Google API Sim] Updating sheet ${params.spreadsheetId} at range ${params.range} with ${params.resource.values.length} rows.`);
                    await new Promise(res => setTimeout(res, 600));
                    return { spreadsheetId: params.spreadsheetId, updatedRows: params.resource.values.length };
                }
            }
        }
    }
}

const apiClient = new GoogleApiClient();


// --- Authentication Functions ---
const mockGoogleUser: GoogleUser = {
    email: 'admin.manager@pet-tech.io',
    name: 'Admin Manager',
    picture: 'https://i.pravatar.cc/150?u=admin.manager@pet-tech.io'
};

export const getMockUser = (): GoogleUser => {
    return mockGoogleUser;
};

export const signIn = (): GoogleUser => {
    // --- REAL OAUTH 2.0 FLOW SIMULATION ---
    // 1. A real app would redirect the user to Google's consent screen,
    //    passing the GOOGLE_CLIENT_ID.
    // 2. After user consent, Google redirects back to a specified URI with an authorization code.
    // 3. Your backend server receives this code, and exchanges it for an access token
    //    by sending the code, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET to Google.
    // 4. The server securely stores the token and sends it to the frontend.

    // This simulation generates a fake token to mimic a successful login.
    console.log(`[Simulated OAuth] Using placeholder GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}`);
    console.warn(`[Security Warning] The provided GOOGLE_CLIENT_SECRET is a secret and should ONLY ever be handled by a secure backend server, never in frontend code.`);

    const fakeToken = `fake-token-${Date.now()}`;
    apiClient.setToken(fakeToken);
    localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(mockGoogleUser));
    return mockGoogleUser;
};

export const signOut = (): void => {
    apiClient.clearToken();
    localStorage.removeItem(GOOGLE_USER_KEY);
};

export const getCurrentUser = (): GoogleUser | null => {
    if (!apiClient.isAuthenticated()) return null;
    const userStr = localStorage.getItem(GOOGLE_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
};


// --- Service Integration Functions ---

export const syncCalendar = async (onProgress: (messageKey: keyof Translations) => void): Promise<{ message: string }> => {
    if (!apiClient.isAuthenticated()) throw new Error("Error: Not authenticated with Google.");

    const unsynced = await db.getUnsyncedAppointments();
    if (unsynced.length === 0) {
        return { message: 'No hay nuevas citas para sincronizar.' };
    }

    onProgress('dashboard.google.inserting_events');
    for (const app of unsynced) {
        const client = await db.getClientById(app.clientId);
        // Assuming 1 hour duration for simplicity
        const startTime = new Date(`${app.date}T${app.time}:00`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const event = {
            summary: `Cita: ${app.service} para ${app.petName}`,
            location: app.address,
            description: `Cliente: ${client?.name}\nTeléfono: ${client?.phone}`,
            start: { dateTime: startTime.toISOString(), timeZone: 'America/Bogota' },
            end: { dateTime: endTime.toISOString(), timeZone: 'America/Bogota' },
            attendees: [{ email: client?.email }],
        };
        await apiClient.calendar.events.insert('primary', event);
    }
    
    await db.markAppointmentsAsSynced();
    return { message: `${unsynced.length} cita(s) sincronizada(s) con Google Calendar.` };
};

export const backupToDrive = async (onProgress: (messageKey: keyof Translations) => void): Promise<{ message: string }> => {
    if (!apiClient.isAuthenticated()) throw new Error("Error: Not authenticated with Google.");

    onProgress('dashboard.google.uploading_backup');

    const [clients, appointments, leads, expenses] = await Promise.all([
        db.getClients(), db.getAppointments(), db.getLeads(), db.getExpenses()
    ]);

    const backupData = JSON.stringify({
        createdAt: new Date().toISOString(),
        clients, appointments, leads, expenses,
    }, null, 2);

    const fileMetadata = { name: `pet-tech-backup-${new Date().toISOString().split('T')[0]}.json` };
    const media = { mimeType: 'application/json', body: backupData };

    await apiClient.drive.files.create(fileMetadata, media);
    
    return { message: `Copia de seguridad creada en Google Drive.` };
};

export const exportToSheets = async (onProgress: (messageKey: keyof Translations) => void): Promise<{ message: string }> => {
     if (!apiClient.isAuthenticated()) throw new Error("Error: Not authenticated with Google.");

    onProgress('dashboard.google.creating_sheet');

    const [appointments, clients] = await Promise.all([db.getAppointments(), db.getClients()]);
    
    const spreadsheet = await apiClient.sheets.spreadsheets.create({
        properties: { title: `Reporte de Citas Pet-Tech - ${new Date().toLocaleDateString()}` }
    });
    
    onProgress('dashboard.google.populating_sheet');

    const header = ["ID Cita", "Fecha", "Hora", "Nombre Cliente", "Nombre Mascota", "Servicio", "Estado", "Pago", "Sincronizado"];
    const rows = appointments.map(app => {
        const clientName = clients.find(c => c.id === app.clientId)?.name || 'N/A';
        return [ app.id, app.date, app.time, clientName, app.petName, app.service, app.status, app.paymentStatus, String(app.syncedToGoogle) ];
    });

    await apiClient.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheet.spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        resource: { values: [header, ...rows] },
    });

    return { message: `${appointments.length} citas exportadas a una nueva hoja de cálculo.` };
};