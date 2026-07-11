---
title: '[ 자료구조 ] 선형 리스트 (Linear List)'
description: '1. 선형 리스트 생성 languages.append(None) length = len(languages) for i in range(length - 1, position, -1):
  languages[i] = languages[i - 1] languages[i - 1] = None languages[position] ='
summary: '1. 선형 리스트 생성 languages.append(None) length = len(languages) for i in range(length - 1, position, -1):
  languages[i] = languages[i - 1] languages[i - 1] = None languages[position] ='
pubDate: 2022-06-21 15:47:29 +0900
slug: tistory-10
kind: note
lang: ko
tags:
- Major class
- 자료구조
- 컴퓨터공학과
- 선형리스트
categories:
- tistory
- course
sourceUrl: https://jms3084.tistory.com/10
sourceBlog: Jisanglee Tistory
tistoryId: 10
tistoryCategory: Major class/자료구조
---

<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="https://jms3084.tistory.com/10" target="_blank" rel="noopener noreferrer">https://jms3084.tistory.com/10</a></p>
<h2>1. 선형 리스트 생성</h2>
<pre class="matlab"><code>languages.append(None)   
    length = len(languages)
    for i in range(length - 1, position, -1):
        languages[i] = languages[i - 1]
        languages[i - 1] = None
    languages[position] = language
</code></pre>
<h2>2. 선형 리스트 삽입</h2>
<pre class="matlab"><code>languages.append(None)
    length = len(languages)
    for i in range(length - 1, position, -1):
        languages[i] = languages[i - 1]
        languages[i - 1] = None
    languages[position] = language
</code></pre>
<h2>3. 선형 리스트 삭제</h2>
<pre class="maxima"><code>length = len(languages)
    languages[position] = None
    for i in range(position + 1, length):
        languages[i - 1] = languages[i]
    
    del languages[length - 1]
</code></pre>
<h2>4. 선형 리스트의 특징</h2>
<ul>
<li>데이터를 일정한 순서로 나열한 자료구조, <b>순차리스트</b>라고도 한다.</li>
<li>입력 순서대로 저장하는 데이터에 적당하다.</li>
<li>가장 기본적인 구현 방법은 <b>배열</b>을 이용한다.</li>
<li>선형리스트로 구현할 수 있는 응용분야는 <b>다항식</b>이 있다.</li>
</ul>
