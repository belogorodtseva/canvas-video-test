declare var CCapture: any;

export class CCaptureWrapped {

    private readonly cc: any;

    constructor(config: CCaptureConfig) {
        this.cc = new CCapture(config);
    }

    capture(t: any) {
        this.cc.capture(t);
    }

    on(t: any, e: any) {
        this.cc.on(t, e);
    }

    save(t?: any) {
        this.cc.save(t);
    }

    start() {
        this.cc.start();
    }

    stop() {
        this.cc.stop();
    }
}

interface CCaptureConfig {
    framerate: number;
    format: string;
    quality: number;
}
