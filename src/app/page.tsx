"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Menu,
  MessageCircle,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteData } from "./const/data";

gsap.registerPlugin(ScrollTrigger);

const iconByName = {
  monitor: Monitor,
  smartphone: Smartphone,
  search: Search,
  messageCircle: MessageCircle,
  sparkles: Sparkles,
  settings: Code2,
} as const;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [visibleProjects, setVisibleProjects] = useState(2);
  const [lastProject, setLastProject] = useState(
    Math.max(siteData.portfolio.projects.length - 2, 0),
  );

  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const navigation = siteData.navigation;
  const projects = siteData.portfolio.projects;

  // Animaciones con GSAP para la entrada y ScrollTrigger en secciones
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación inicial de carga del Hero
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".site-header", { y: -30, opacity: 0, duration: 1 })
        .from(
          ".hero-copy > *",
          { y: 40, opacity: 0, stagger: 0.15, duration: 1 },
          "-=0.5",
        )
        .from(
          ".hero-visual",
          { scale: 0.95, opacity: 0, duration: 1.2 },
          "-=0.8",
        );

      // Animaciones al hacer scroll en las secciones principales
      const sections = gsap.utils.toArray<HTMLElement>(
        ".section, .about-section, .contact-section, .stats-strip",
      );
      sections.forEach((sec) => {
        gsap.from(
          sec.querySelectorAll(
            ".section-heading, .project-card, .about-content, .about-image-wrap, .contact-inner > *",
          ),
          {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const rail = carouselRef.current;
    if (!rail) return;

    const updatePosition = () => {
      const card = rail.querySelector<HTMLElement>(".project-card");
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 24;
      const step = card.getBoundingClientRect().width + gap;
      const visible = Math.max(1, Math.floor((rail.clientWidth + gap) / step));
      const last = Math.max(0, projects.length - visible);
      setVisibleProjects(visible);
      setLastProject(last);
      setActiveProject(Math.min(last, Math.round(rail.scrollLeft / step)));
    };

    updatePosition();
    rail.addEventListener("scroll", updatePosition, { passive: true });
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(rail);

    return () => {
      rail.removeEventListener("scroll", updatePosition);
      resizeObserver.disconnect();
    };
  }, [projects.length]);

  const moveCarousel = (direction: -1 | 1) => {
    const rail = carouselRef.current;
    const card = rail?.querySelector<HTMLElement>(".project-card");
    if (!rail || !card) return;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 24;
    const next = Math.max(0, Math.min(lastProject, activeProject + direction));
    const step = card.getBoundingClientRect().width + gap;
    setActiveProject(next);
    rail.scrollTo({
      left: next * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };


  // Esto detecta el efecto neon del mouse
  const trackPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    event.currentTarget.style.setProperty("--pointer-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${event.clientY}px`);
    event.currentTarget.classList.add("is-tracking");
  };

  const trackHeroPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--hero-pointer-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--hero-pointer-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  const stopTrackingPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.classList.remove("is-tracking");
  };

  return (
    <main
      className="site-shell"
      ref={containerRef}
      onPointerMove={trackPointer}
      onPointerLeave={stopTrackingPointer}
    >
      <div className="ambient-backdrop" aria-hidden="true" />
      <div className="pointer-light" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="DISAWebs, inicio">
          <span className="wordmark-icon">
            {" "}
            <img src="/my-logo-disawebs.png" alt="" />
          </span>
          <span>
            DISA<span className="accent-text">Webs</span>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Navegación principal"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contacto"
            onClick={() => setMenuOpen(false)}
          >
            Hablemos <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      <section className="hero" id="inicio" onPointerMove={trackHeroPointer}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="availability-dot" /> DESARROLLO WEB · TANDIL,
            ARGENTINA
          </p>
          <h1>
            Tu próximo sitio web empieza con <span>una buena idea.</span>
          </h1>
          <p className="hero-description">
            Diseño y desarrollo experiencias digitales a medida para que tu
            negocio se vea mejor, conecte con sus clientes y crezca online.
          </p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="https://wa.me/5492494379804?text=Hola%20Lautaro,%20quiero%20consultarte%20por%20una%20p%C3%A1gina%20web."
              target="_blank"
              rel="noreferrer"
            >
              Empezar un proyecto <ArrowUpRight size={17} />
            </a>
            <a className="button button-quiet" href="#portfolio">
              Explorar proyectos <ArrowDown size={16} />
            </a>
          </div>
          <div className="hero-meta">
            <span>+2 años de experiencia</span>
            <span className="meta-divider" />
            <span>Diseño · Desarrollo · Lanzamiento</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-photo-frame">
            <img
              src="/my-photo-without-bg.png"
              alt="Lautaro Di Salvo, desarrollador web"
            />
          </div>
          <div className="hero-note">
            <span className="note-icon">
              <Sparkles size={16} />
            </span>
            <span>
              <strong>Ideas que toman forma</strong>
              <small>Diseño con intención, código con criterio.</small>
            </span>
          </div>
          <span className="hero-index">01 / 05</span>
        </div>
        <a className="scroll-cue" href="#servicios">
          <span>DESCUBRÍ LO QUE PODEMOS CREAR</span>
          <ArrowDown size={15} />
        </a>
      </section>

      <section className="stats-strip" aria-label="Mi enfoque">
        {siteData.stats.map((stat, index) => (
          <div className="stat-item" key={stat.label}>
            <span className="stat-index">0{index + 1}</span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section services-section" id="servicios">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — SERVICIOS</p>
            <h2>
              Una web que trabaja
              <br />
              <span>para tu negocio.</span>
            </h2>
          </div>
          <p>
            Cada proyecto parte de entender a quién querés llegar y qué
            necesitás lograr. Después, lo convertimos en una experiencia clara,
            rápida y hecha para vos.
          </p>
        </div>
        <div className="services-grid">
          {siteData.services.items.map((item, index) => {
            const Icon =
              iconByName[item.icon as keyof typeof iconByName] ?? Code2;
            return (
              <article className="service-card" key={item.title}>
                <span className="service-number">0{index + 1}</span>
                <span className="service-icon">
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ArrowDownRight className="service-arrow" size={18} />
              </article>
            );
          })}
        </div>
      </section>

      <section className="section portfolio-section" id="portfolio">
        <div className="section-heading portfolio-heading">
          <div>
            <p className="eyebrow">02 — PROYECTOS</p>
            <h2>
              Trabajo real,
              <br />
              <span>ideas en movimiento.</span>
            </h2>
          </div>
          <p>
            Una selección de proyectos para marcas, negocios y personas con algo
            propio que contar.
          </p>
        </div>

        <div className="carousel-toolbar">
          <p
            className="carousel-status"
            aria-label={`Mostrando proyectos ${activeProject + 1} a ${Math.min(activeProject + visibleProjects, projects.length)}
       de ${projects.length}`}
          >
            <span>{String(activeProject + 1).padStart(2, "0")}</span>
            <i aria-hidden="true">—</i>
            <span>
              {String(
                Math.min(activeProject + visibleProjects, projects.length),
              ).padStart(2, "0")}
            </span>
            <small>
              / {String(projects.length).padStart(2, "0")} PROYECTOS
            </small>
          </p>
          <div className="carousel-progress" aria-hidden="true">
            <span
              style={{
                width: `${lastProject === 0 ? 100 : ((activeProject + 1) / (lastProject + 1)) * 100}%`,
              }}
            />
          </div>




        <div className="carousel-controls" role="group" aria-label="Controles del carrusel de proyectos">
            <button type="button" onClick={() => moveCarousel(-1)} disabled={activeProject === 0} aria-label="Proyecto anterior"><ArrowDownRight size={17} /></button>
            <button type="button" onClick={() => moveCarousel(1)} disabled={activeProject >= lastProject} aria-label="Proyecto siguiente"><ArrowDownRight size={17} /></button>
          </div>
        </div>


        
        <div
          className="portfolio-rail"
          ref={carouselRef}
          aria-label="Proyectos seleccionados"
          aria-roledescription="carrusel"
        >
          {projects.map((project, index) => (
            <article
              className="project-card"
              key={project.id}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${projects.length}`}
            >
              <a
                className="project-image"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visitar el sitio de ${project.data}`}
              >
                <img
                  src={project.img}
                  alt={`Captura del proyecto ${project.data}`}
                  loading="lazy"
                />
                <span className="project-view">
                  Ver proyecto <ArrowUpRight size={16} />
                </span>
                <span className="project-index">0{index + 1}</span>
                <span className="project-glint" aria-hidden="true" />
              </a>
              <div className="project-body">
                <div style={{ width: "100%" }}>
                  {project.date && (
                    <span
                      className="project-date"
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: "#888",
                        fontWeight: 500,
                        marginBottom: "4px",
                      }}
                    >
                      {project.date}
                    </span>
                  )}
                  <h3>{project.data}</h3>
                  <span className="project-tech">{project.tech}</span>
                </div>
                <a
                  className="project-external"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${project.data}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="portfolio-footer">
          <span>¿Tu proyecto podría ser el próximo?</span>
          <a href="#contacto">
            Contame tu idea <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="about-section" id="sobre-mi">
        <div className="about-image-wrap">
          <img
            src={siteData.about.photo.src}
            alt={siteData.about.photo.alt}
            loading="lazy"
          />
          <span className="about-image-caption">
            LAUTARO DI SALVO · DESARROLLADOR WEB
          </span>
        </div>
        <div className="about-content">
          <p className="eyebrow">03 — SOBRE MÍ</p>
          <h2>
            Hola, soy Lautaro.
            <br />
            <span>Me gusta crear cosas que sirven.</span>
          </h2>
          {siteData.about.paragraphs.map((paragraph) => (
            <p className="about-paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <div className="highlight-list">
            {siteData.about.highlights.map((highlight) => (
              <div className="highlight" key={highlight}>
                <Check size={16} />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
          <a
            className="text-link"
            href={siteData.about.cv.href}
            target="_blank"
            rel="noreferrer"
          >
            Conocé mi recorrido <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="contact-section" id="contacto">
        <div className="contact-inner">
          <div className="contact-copy">
            <p className="eyebrow">04 — CONTACTO</p>
            <h2>
              ¿Lo hacemos
              <br />
              <span>realidad?</span>
            </h2>
            <p>
              Contame un poco de tu idea. Te respondo personalmente y vemos
              juntos cuál es el mejor próximo paso.
            </p>
            <a
              className="button button-primary"
              href="https://wa.me/5492494379804?text=Hola%20Lautaro,%20quiero%20consultarte%20por%20una%20p%C3%A1gina%20web."
              target="_blank"
              rel="noreferrer"
            >
              Escribime por WhatsApp <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="contact-aside">
            <span className="contact-spark">
              <Sparkles size={24} />
            </span>
            <p>
              Un buen proyecto
              <br />
              empieza con una charla.
            </p>
            <span className="contact-location">
              TANDIL, BUENOS AIRES · ARGENTINA
            </span>
            <div className="contact-socials">
              <a
                href="https://www.linkedin.com/in/lautarodisalvofullstack/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
              <a
                href="https://github.com/lautaroDSwebdev"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
              <a
                href="https://www.instagram.com/disawebs"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowUpRight size={14} />
              </a>
              <a
                href="https://www.tiktok.com/@lautadev_98"
                target="_blank"
                rel="noreferrer"
              >
                Tiktok <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#inicio">
          <span className="wordmark-icon">
            <Code2 size={17} />
          </span>
          <span>
            DISA<span className="accent-text">Webs</span>
          </span>
        </a>
        <span>Diseñado y desarrollado por Lautaro Di Salvo</span>
        <a href="#inicio">VOLVER ARRIBA ↑</a>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
