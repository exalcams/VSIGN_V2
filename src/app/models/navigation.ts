export class NavItem {
    displayName: string;
    disabled?: boolean;
    icon?: string;
    icon_active?:string;
    route: string;
    type?: string;
    children?: NavItem[];
}