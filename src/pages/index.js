import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "40vh",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
          }}
        >
          바로가기 리스트 🔖
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Link to="docs/intro" style={{ fontSize: "2rem", fontWeight: "700" }}>
            정리 내용 바로가기 📔
          </Link>
        </div>
        <Link to="blog" style={{ fontSize: "2rem", fontWeight: "700" }}>
          후기 보러가기 📝
        </Link>
      </div>
    </Layout>
  );
}
