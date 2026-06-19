---
layout: page
title: About
description: About the Kkubuck Blog archive
permalink: /about/
---
<div class="page-frame about-page">
  <header class="simple-hero reveal">
    <p class="eyebrow">ABOUT THE ARCHIVE</p>
    <h1>Kkubuck Blog</h1>
    <p>A personal archive for computer vision paper reviews, experiment notes, and implementation memos.</p>
  </header>
  <section class="about-grid section-space">
    <article class="glass-surface reveal">
      <p class="eyebrow">RECORDING PRINCIPLES</p>
      <h2>Keep context, not just summaries.</h2>
      <p>Each note connects the problem setting, design choices, experimental evidence, and limitations so the material can be reused later.</p>
      <ul class="principle-list">
        <li><span>01</span><div><strong>Problem Framing</strong><p>Start from the bottleneck the paper tries to solve and the limits of prior approaches.</p></div></li>
        <li><span>02</span><div><strong>Design Breakdown</strong><p>Track the signal, cost, and alternatives introduced by each module.</p></div></li>
        <li><span>03</span><div><strong>Evidence & Limits</strong><p>Connect quantitative results with failure cases and follow-up experiments.</p></div></li>
      </ul>
    </article>
    <aside class="glass-surface reveal">
      <p class="eyebrow">FOCUS AREAS</p>
      <h2>Main Topics</h2>
      <div class="about-tags">
        <a href="{{ '/tags/' | relative_url }}#cod">Camouflaged Object Detection</a>
        <a href="{{ '/tags/' | relative_url }}#sam">Segment Anything</a>
        <a href="{{ '/tags/' | relative_url }}#segmentation">Segmentation</a>
        <a href="{{ '/tags/' | relative_url }}#remote-sensing">Remote Sensing</a>
      </div>
      <a class="text-link" href="{{ '/papers/' | relative_url }}">Explore papers <svg class="icon" aria-hidden="true"><use href="{{ '/assets/icons.svg' | relative_url }}#arrow"></use></svg></a>
    </aside>
  </section>
</div>
