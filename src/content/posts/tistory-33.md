---
title: 백준 14681번 C++
description: '#include <iostream> using namespace std; int main(){ int a,b; cin>>a; cin>>b; if((a>=-1000&&a<=1000)&&(b>=-1000&&b<=1000)){
  if(a>0&&b>0){ cout<<"1"; } if(a<0&&b>0){ cout<<"2"; } if'
summary: '#include <iostream> using namespace std; int main(){ int a,b; cin>>a; cin>>b; if((a>=-1000&&a<=1000)&&(b>=-1000&&b<=1000)){
  if(a>0&&b>0){ cout<<"1"; } if(a<0&&b>0){ cout<<"2"; } if'
pubDate: 2022-09-05 11:16:15 +0900
slug: tistory-33
kind: note
lang: ko
tags:
- Coding test
- 백준
- '14681'
- C++
categories:
- tistory
- coding-test
sourceUrl: https://jms3084.tistory.com/33
sourceBlog: Jisanglee Tistory
tistoryId: 33
tistoryCategory: Coding test/백준
---

<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="https://jms3084.tistory.com/33" target="_blank" rel="noopener noreferrer">https://jms3084.tistory.com/33</a></p>
<p><figure class="imageblock alignCenter"><img alt="" loading="lazy" src="/assets/img/tistory/33/image-01.png"/></figure>
</p>
<pre class="cpp"><code>#include &lt;iostream&gt;
using namespace std;

int main(){
    int a,b;
    cin&gt;&gt;a;
    cin&gt;&gt;b;
    if((a&gt;=-1000&amp;&amp;a&lt;=1000)&amp;&amp;(b&gt;=-1000&amp;&amp;b&lt;=1000)){
    if(a&gt;0&amp;&amp;b&gt;0){
        cout&lt;&lt;"1";
    }
     if(a&lt;0&amp;&amp;b&gt;0){
        cout&lt;&lt;"2";
    }
     if(a&lt;0&amp;&amp;b&lt;0){
        cout&lt;&lt;"3";
    }
     if(a&gt;0&amp;&amp;b&lt;0){
        cout&lt;&lt;"4";
        }
    }
}</code></pre>
