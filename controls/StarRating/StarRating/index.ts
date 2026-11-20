import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class StarRating implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private value = 0;
    private maxStars = 5;
    private isReadOnly = false;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container.classList.add("star-rating");
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.value = context.parameters.value.raw ?? 0;
        this.maxStars = context.parameters.maxStars.raw ?? 5;
        this.isReadOnly = context.mode.isControlDisabled;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = "";
        for (let i = 1; i <= this.maxStars; i++) {
            const star = document.createElement("span");
            star.className = "star" + (i <= this.value ? " filled" : "");
            star.textContent = "★";
            star.setAttribute("role", "button");
            star.setAttribute("aria-label", `${i} star${i > 1 ? "s" : ""}`);
            if (!this.isReadOnly) {
                star.addEventListener("click", () => this.setValue(i));
            }
            this.container.appendChild(star);
        }
    }

    private setValue(newValue: number): void {
        // Clicking the current rating again clears it
        this.value = newValue === this.value ? 0 : newValue;
        this.notifyOutputChanged();
        this.render();
    }

    public getOutputs(): IOutputs {
        return { value: this.value };
    }

    public destroy(): void {
        // Nothing to clean up
    }
}
