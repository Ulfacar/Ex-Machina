'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowIcon } from './icons';

export function Navbar() {
  useEffect(() => {
    const nav = document.querySelector(".nav-inner");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="nav-brand" href="#">
          <span className="mark">x</span>
          ex machine
        </Link>
        <div className="nav-links">
          <Link href="#how">Как это работает</Link>
          <Link href="#demo">Демо</Link>
          <Link href="#features">Фичи</Link>
          <Link href="#pricing">Цены</Link>
          <Link href="#case">Кейсы</Link>
        </div>
        <div className="nav-cta">
          <Link className="btn btn-ghost" href="/login">Войти</Link>
          <Link className="btn btn-primary" href="#wizard">Запустить бота</Link>
        </div>
      </div>
    </nav>
  );
}
