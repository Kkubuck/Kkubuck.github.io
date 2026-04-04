---
layout: page
title: 리뷰 방법
description: 이 블로그에서 논문을 어떻게 읽고 정리하는지 설명합니다.
permalink: /papers/review/
---

<div id="paper-review">
  <section class="review-hero">
    <p class="eyebrow">Review Method</p>
    <h1>논문 리뷰 방법</h1>
    <p class="lead">홈에서는 리뷰 글 자체를 먼저 보여주고, 이 페이지에서는 글을 정리하는 기준과 자동화 환경을 따로 설명합니다.</p>
  </section>

  <section class="review-grid">
    <article class="review-card">
      <p class="review-title">리뷰 원칙</p>
      <p>모든 글은 논문이 무엇을 주장하는지, 어떤 설계가 핵심인지, 실험이 그 주장을 얼마나 잘 뒷받침하는지를 중심으로 정리합니다.</p>
    </article>
    <article class="review-card">
      <p class="review-title">대표 시각 자료</p>
      <p>한 장으로 논문 구조를 보여주는 오버뷰 피규어 1개와 대표 비교 결과가 담긴 메인 실험 테이블 1개를 우선 선택합니다.</p>
    </article>
    <article class="review-card">
      <p class="review-title">자동화 환경</p>
      <p>논문 포스트 생성은 로컬 맥 환경에서 동작하는 <code>paper-blog</code> 파이프라인과 Qwen 계열 모델을 기준으로 구성했습니다.</p>
    </article>
  </section>

  <section class="review-section">
    <h2>사용하는 로컬 툴</h2>
    <p>포스트 생성기는 PDF 또는 arXiv URL을 입력받아 본문과 그림을 추출하고, 논문 포맷에 맞는 Markdown 글과 자산 폴더를 만듭니다.</p>
    <ul>
      <li><code>paper-blog</code> CLI: 논문 추출, 포스트 생성, 게시 자동화</li>
      <li><code>Qwen3-14B</code>: 기본 요약 모델</li>
      <li><code>Qwen3-8B</code>: 속도 또는 메모리 제한 시 fallback</li>
      <li>Jekyll + GitHub Pages: 블로그 게시</li>
    </ul>
  </section>

  <section class="review-section">
    <h2>글을 정리하는 순서</h2>
    <ol>
      <li>논문의 핵심 주장과 문제 설정을 먼저 잡습니다.</li>
      <li>전체 구조를 가장 잘 보여주는 대표 그림을 고릅니다.</li>
      <li>대표 실험 결과가 담긴 메인 테이블을 고릅니다.</li>
      <li>초록, 서론, 본론, 제안방법, 실험, 결론, 논의 순서로 글을 정리합니다.</li>
      <li>최종 포스트는 한국어 본문으로 다듬고 GitHub 블로그에 게시합니다.</li>
    </ol>
  </section>

  <section class="review-section">
    <h2>왜 홈에서 툴 설명을 줄였나</h2>
    <p>홈은 블로그의 첫인상이라서, 방문자가 먼저 봐야 하는 것은 툴 소개보다 실제 논문 리뷰 글입니다. 그래서 생성 파이프라인과 모델 설명은 이 페이지로 옮기고, 홈은 블로그처럼 보이도록 정리했습니다.</p>
  </section>

  <section class="review-section">
    <h2>자동화 도구 저장소</h2>
    <p>실제 생성기와 자동 게시 코드는 별도 repo인 <a href="https://github.com/Kkubuck/paper-blog-toolkit" target="_blank" rel="noreferrer"><code>Kkubuck/paper-blog-toolkit</code></a> 에서 관리합니다.</p>
  </section>
</div>
