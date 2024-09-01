import { connect, Mongoose, set } from 'mongoose';
import { EnvConfig } from '../configs';
export class MongoDataSource {
    private static mongoConnection: Mongoose = undefined;

    private constructor() { }

    public static async connect(): Promise<void> {

        const mongoUrl = EnvConfig.database.host+ EnvConfig.database.name;
        
        if (!this.isConnected()) {
            connect(mongoUrl
            , {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                socketTimeoutMS: 60000,
                connectTimeoutMS: 60000,
            }
        )
                .then((connection) => {
                    console.log("================Successfully Connected===============");
                    this.setConnection(connection);
                })
                .catch((err) => {
                    console.warn(`mongo connection error`, err);
                });
        } else {
            console.info(`Database Already Connected`);
        }
    }

    public static setConnection(connection: Mongoose): void {
        this.mongoConnection = connection;
        this.mongoConnection.connection.on("disconnected", (error) => {
            console.error("database connection closed", error);
        });
    }

    public static isConnected(): boolean {
        if (this.mongoConnection && this.mongoConnection.connection) {
            const { readyState } = this.mongoConnection.connection;
            console.info(`MongoDB ready state = ${readyState}`);
            return readyState === 1;
        }
        return false;
    }

    public static getConnection(): Mongoose {
        return this.mongoConnection;
    }

    public static disconnect(): void {
        this.mongoConnection.connection.close(() => {
            this.mongoConnection = undefined;
            process.exit(0);
        });
    }

}
