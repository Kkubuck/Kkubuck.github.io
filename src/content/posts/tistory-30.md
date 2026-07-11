---
title: 백준 25304번 Python
description: 'all = int(input()) num = int(input()) for i in range(num): price, n = map(int, input().split()) all-=price
  * n if all == 0: print(''Yes'') else: print(''No'')'
summary: 'all = int(input()) num = int(input()) for i in range(num): price, n = map(int, input().split()) all-=price
  * n if all == 0: print(''Yes'') else: print(''No'')'
pubDate: 2022-09-05 11:12:30 +0900
slug: tistory-30
kind: note
lang: ko
tags:
- Coding test
- 백준
- '25304'
- 구현
- 사칙연산
- 수학
- 영수증
categories:
- tistory
- coding-test
sourceUrl: https://jms3084.tistory.com/30
sourceBlog: Jisanglee Tistory
tistoryId: 30
tistoryCategory: Coding test/백준
---

<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="https://jms3084.tistory.com/30" target="_blank" rel="noopener noreferrer">https://jms3084.tistory.com/30</a></p>
<p><figure class="imageblock alignCenter"><img alt="" loading="lazy" src="/assets/img/tistory/30/image-01.png"/></figure>
</p>
<pre class="python"><code>all = int(input())
num = int(input())

for i in range(num):
    price, n = map(int, input().split())    
    all-=price * n

if all == 0:
    print('Yes')
else:
    print('No')</code></pre>
