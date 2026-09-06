export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/**
 * 4 links de navegacao (design-system.md secao 8.1: About/Work/Testimonials/Contact),
 * mesma ordem/rotulos reaproveitados no menu mobile (secao 8.13, "mesmos rotulos/ordem
 * da navegacao do Header desktop"). Fonte unica compartilhada entre `Header` (nav
 * horizontal, escondida abaixo do desktop) e `MobileMenu` (overlay, visivel abaixo do
 * desktop) - evita duplicar a lista em dois componentes que precisam ficar em sincronia.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Sobre', href: '#about' },
  { label: 'Projetos', href: '#work' },
  { label: 'Depoimentos', href: '#testimonials' },
  { label: 'Contato', href: '#contact' },
];
