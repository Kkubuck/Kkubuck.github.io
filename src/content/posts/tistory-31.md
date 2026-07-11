---
title: 백준 18258번 Python
description: 'import sys from collections import deque n = int(sys.stdin.readline().rstrip()) queue =deque([]) for
  i in range(n): ans = sys.stdin.readline().rstrip().split() if ans[0]==''push'': q'
summary: 'import sys from collections import deque n = int(sys.stdin.readline().rstrip()) queue =deque([]) for i
  in range(n): ans = sys.stdin.readline().rstrip().split() if ans[0]==''push'': q'
pubDate: 2022-09-05 11:13:40 +0900
slug: tistory-31
kind: note
lang: ko
tags:
- Coding test
- 백준
- '18258'
- 알고리즘
- 큐
categories:
- tistory
- coding-test
sourceUrl: https://jms3084.tistory.com/31
sourceBlog: Jisanglee Tistory
tistoryId: 31
tistoryCategory: Coding test/백준
---

<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="https://jms3084.tistory.com/31" target="_blank" rel="noopener noreferrer">https://jms3084.tistory.com/31</a></p>
<p><figure class="imageblock alignCenter"><img alt="" loading="lazy" src="/assets/img/tistory/31/image-01.png"/></figure>
</p>
<pre class="python"><code>import sys
from collections import deque
n = int(sys.stdin.readline().rstrip())

queue =deque([])

for i in range(n):
    ans = sys.stdin.readline().rstrip().split()

    if ans[0]=='push':
        queue.append(ans[1])
    
    if ans[0]=='pop':
        if len(queue):
            print(queue.popleft())
        else:
            print(-1)

    if ans[0]=='size':
        print(len(queue))
    
    if ans[0]=='empty':
        if len(queue):
            print(0)
        else:
            print(1)
    
    if ans[0]=='front':
        if len(queue):
            print(queue[0])
        else:
            print(-1)

    if ans[0]=='back':
        if len(queue):
            print(queue[-1])
        else:
            print(-1)</code></pre>
