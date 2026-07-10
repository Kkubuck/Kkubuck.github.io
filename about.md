---
layout: page
title: 소개
description: 논문을 읽고 연구를 만들며 남긴 Kkubuck 연구 아카이브 소개
permalink: /about/
---
<div class="page-frame about-page">
  <header class="simple-hero reveal">
    <p class="eyebrow">이 아카이브에 관하여</p>
    <h1>읽은 것을<br>다시 쓸 수 있게.</h1>
    <p>컴퓨터 비전 논문을 읽고, 실험하고, 구현하면서 생긴 판단을 축적하는 개인 연구 노트입니다. 요약보다 맥락을, 결과보다 다음 실험에 쓸 수 있는 근거를 남깁니다.</p>
  </header>

  <section class="about-grid section-space">
    <article class="about-intro surface reveal">
      <p class="eyebrow">글을 쓰는 기준</p>
      <h2>논문을 읽는 세 가지 기준</h2>
      <p>모듈 이름을 나열하기보다 저자가 어떤 병목을 발견했고, 그 선택이 실험에서 무엇을 바꾸었는지 연결해서 기록합니다.</p>
      <ul class="about-checklist">
        <li><span>01</span><div><strong>문제부터 확인하기</strong><p>기존 방법이 실패하는 장면과 논문이 실제로 풀려는 범위를 먼저 분리합니다.</p></div></li>
        <li><span>02</span><div><strong>설계를 원인과 결과로 읽기</strong><p>각 구성요소가 어떤 정보 부족을 보완하며, 그 대가가 무엇인지 따라갑니다.</p></div></li>
        <li><span>03</span><div><strong>숫자보다 증거의 모양 보기</strong><p>평균 성능뿐 아니라 데이터셋 간 변화, 작은 객체·경계·도메인 이동에서의 거동을 함께 봅니다.</p></div></li>
      </ul>
    </article>
    <aside class="about-focus surface reveal">
      <p class="eyebrow">현재 관심 주제</p>
      <h2>관심 연구</h2>
      <div class="focus-list">
        <span>Camouflaged Object Detection</span>
        <span>Open-vocabulary Vision</span>
        <span>Foundation Models</span>
        <span>Remote Sensing</span>
        <span>Medical Imaging</span>
        <span>Image Forensics</span>
      </div>
      <a class="text-link" href="{{ '/papers/' | relative_url }}">논문 노트 둘러보기 <svg class="icon" aria-hidden="true"><use href="{{ '/assets/icons.svg' | relative_url }}#arrow"></use></svg></a>
    </aside>
  </section>
</div>
