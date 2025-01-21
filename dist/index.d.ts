import { Page } from "@playwright/test";
export declare function checkHeadingsVisibility(page: Page): Promise<void>;
export declare function checkButtonsVisibilityAndAriaLabel(page: Page): Promise<void>;
export declare function checkImagesVisibility(page: Page): Promise<void>;
export declare function checkAllExternalLinks(page: Page): Promise<void>;
type WebSocketMessage = {
    type: "sent" | "received";
    message: string;
};
/**
 * You can filter to catch all WS messages on a domain(/localhost/) or only those matching a specific URL:PORT i.e. /localhost:4201/.
 * @param page
 * @param options
 * @returns Array of WebSocket messages sent and received
 */
export declare function captureWebSocketMessages(page: Page, options?: {
    urlFilter?: string | RegExp;
    timeout?: number;
}): Promise<WebSocketMessage[]>;
export {};
