---
title: 백준 11650번 Python
description: 'n = int(input()) x = [] for i in range(n): a, b = map(int, input().split()) x.append((a, b)) x.sort()
  for i in range(n): print(x[i][0], x[i][1])'
summary: 'n = int(input()) x = [] for i in range(n): a, b = map(int, input().split()) x.append((a, b)) x.sort()
  for i in range(n): print(x[i][0], x[i][1])'
pubDate: 2022-09-05 11:17:24 +0900
slug: tistory-34
kind: note
lang: ko
tags:
- Coding test
- 백준
- '11650'
- 파이썬
categories:
- tistory
- coding-test
sourceUrl: https://jms3084.tistory.com/34
sourceBlog: Jisanglee Tistory
tistoryId: 34
tistoryCategory: Coding test/백준
---

<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="https://jms3084.tistory.com/34" target="_blank" rel="noopener noreferrer">https://jms3084.tistory.com/34</a></p>
<p><figure class="imageblock alignCenter"><img alt="" loading="lazy" src="/assets/img/tistory/34/image-01.png"/></figure>
</p>
<pre class="python"><code>n = int(input())
x = []

for i in range(n):
    a, b = map(int, input().split())
    x.append((a, b))
x.sort()
for i in range(n):
    print(x[i][0], x[i][1])</code></pre>
