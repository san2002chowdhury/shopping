export const EnvConfig = {
    server: {
        port: Number.parseInt(process.env.PORT, 10) || 8080,
        environment: process.env.ENV || "PROD",
    },
    database: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST
    }
}