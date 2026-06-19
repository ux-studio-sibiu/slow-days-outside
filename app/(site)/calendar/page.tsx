// /calendar renders the exact same page as the home route — re-exported so
// there is a single source of truth (see app/(site)/page.tsx).
export { default } from "../page";
export const revalidate = 60; // seconds
