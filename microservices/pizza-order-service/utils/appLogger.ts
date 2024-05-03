class AppLogger {
    error(e: any): void {
        console.error(e);
    }
    log(e: String): void {
        console.log(e);
    }
}

export { AppLogger };
