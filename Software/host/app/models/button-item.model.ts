export class ButtonItem {

    disabled?: boolean;

    dropdown?: boolean;

    id: string;

    icons?: { primary?: string, secondary?: string };

    label: string;

    click?: (e) => void;
}