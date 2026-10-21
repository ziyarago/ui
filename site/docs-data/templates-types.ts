export interface SlotProp { name: string; type: string; desc: string }
export interface SlotDoc { id: string; title: string; desc: string; accepts: string[]; props: SlotProp[]; use: string }
export interface TemplatePage {
  key: string
  route: string
  label: string
  icon: string
  desc: string
  /** library component, e.g. PageDashboard */
  component: string
  /** docs-site preview component under components/templates, e.g. TplDashboard */
  tpl: string
  /** rendered inside the AppShell frame; false = full-screen page (auth, status) */
  shell: boolean
  slots: SlotDoc[]
}
export interface TemplateData { shell: SlotDoc[]; footer: SlotDoc; pages: TemplatePage[] }
