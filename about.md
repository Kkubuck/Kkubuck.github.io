---
layout: page
title: 소개
description: Kkubuck 연구 블로그의 방향과 기록 원칙
permalink: /about/
---
<div class="page-frame about-page">
  <header class="about-hero reveal">
    <div>
      <p class="display-kicker">About this research archive</p>
      <h1>읽고, 구현하고,<br><span>다시 찾을 수 있게 기록합니다.</span></h1>
      <p>Kkubuck은 컴퓨터 비전 논문 리뷰와 개인 연구, 구현 과정에서 생긴 판단을 축적하는 개인 아카이브입니다.</p>
    </div>
    <div class="about-hero__mark glass-surface" aria-hidden="true"><span></span><span></span><i></i><strong>K</strong></div>
  </header>

  <section class="about-principles section-space">
    <div class="section-intro reveal"><div><p class="micro-label">Editorial protocol</p><h2>기록 원칙</h2></div><p class="section-intro__note">한 번 읽고 끝나는 요약보다, 연구 판단을 재현할 수 있는 맥락을 남깁니다.</p></div>
    <div class="principle-grid">
      <article class="principle-card glass-surface reveal"><span>01</span><h3>문제부터 읽기</h3><p>모델 구조를 나열하기 전에 논문이 실제로 해결하려는 병목과 기존 접근의 실패 지점을 먼저 정리합니다.</p></article>
      <article class="principle-card glass-surface reveal"><span>02</span><h3>설계의 이유 추적</h3><p>각 모듈이 왜 필요한지, 어떤 신호를 보완하는지, 제거했을 때 무엇이 달라지는지 연결해서 기록합니다.</p></article>
      <article class="principle-card glass-surface reveal"><span>03</span><h3>한계까지 인덱싱</h3><p>성능 수치뿐 아니라 데이터셋 편향, 계산 비용, 실패 사례와 다음 실험 아이디어를 함께 남깁니다.</p></article>
    </div>
  </section>

  <section class="about-fields section-space glass-surface reveal">
    <div><p class="micro-label">Current coordinates</p><h2>주요 관심 영역</h2><p>현재 아카이브는 위장 객체 탐지를 중심으로 foundation model, open-vocabulary segmentation, 비지도 학습, RGB-D 및 비디오 이해를 함께 추적합니다.</p></div>
    <ul><li><span>Camouflaged Object Detection</span><small>Primary field</small></li><li><span>Open-vocabulary Segmentation</span><small>Vision-language</small></li><li><span>Segment Anything Model</span><small>Foundation model</small></li><li><span>Remote Sensing & Forensics</span><small>Applied vision</small></li></ul>
  </section>

  <section class="about-route section-space reveal">
    <div><p class="micro-label">Start exploring</p><h2>아카이브 진입점</h2></div>
    <div class="about-route__links"><a class="glass-surface" href="{{ '/papers/' | relative_url }}"><span>01</span><strong>논문 리뷰</strong><small>핵심 기여와 한계</small><svg class="icon" aria-hidden="true"><use href="{{ '/assets/icons.svg' | relative_url }}#arrow"></use></svg></a><a class="glass-surface" href="{{ '/projects/' | relative_url }}"><span>02</span><strong>프로젝트</strong><small>실험과 도구</small><svg class="icon" aria-hidden="true"><use href="{{ '/assets/icons.svg' | relative_url }}#arrow"></use></svg></a><a class="glass-surface" href="{{ '/cv/' | relative_url }}"><span>03</span><strong>Academic CV</strong><small>Research trajectory</small><svg class="icon" aria-hidden="true"><use href="{{ '/assets/icons.svg' | relative_url }}#arrow"></use></svg></a></div>
  </section>
</div>
