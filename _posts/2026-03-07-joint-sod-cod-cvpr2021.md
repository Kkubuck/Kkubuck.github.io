---
layout: post
title: Uncertainty-Aware Joint Salient Object and Camouflaged Object Detection
subtitle: 서로 반대처럼 보이는 salient object detection과 camouflaged object detection을 함께 학습해, 쉬운 단서와 어려운 단서의 경계를 더 잘 이해하도록 만든 공동 학습
  프레임워크.
summary: SOD와 COD의 상반된 속성을 활용해 두 작업을 함께 개선한다. 쉬운 COD 샘플을 SOD의 어려운 양성으로 사용하고, 유사도 측정과 adversarial uncertainty 학습을 결합한다.
description: SOD와 COD의 상반된 속성을 활용해 두 작업을 함께 개선한다. 쉬운 COD 샘플을 SOD의 어려운 양성으로 사용하고, 유사도 측정과 adversarial uncertainty 학습을 결합한다.
date: 2026-03-07 09:00:00 +0900
slug: joint-sod-cod-cvpr2021
lang: ko
paper: true
categories:
- papers
tags:
- paper
- cod
- sod
- uncertainty
- multi-task
- cvpr-2021
venue: CVPR 2021
paper_year: 2021
paper_authors: Aixuan Li, Jing Zhang, Yunqiu Lv, Bowen Liu, Tong Zhang, Yuchao Dai
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2021/html/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2021/papers/Li_Uncertainty-Aware_Joint_Salient_Object_and_Camouflaged_Object_Detection_CVPR_2021_paper.pdf
code_url: https://github.com/JingZhang617/Joint_COD_SOD
takeaways:
- SOD와 COD를 별개가 아니라 시각적 두드러짐의 양끝으로 바라본다.
- 쉬운 COD 양성 샘플을 SOD의 어려운 양성으로 재사용하고 두 작업의 유사성과 차이를 함께 학습한다.
- 공동 학습 이득은 데이터 구성과 라벨 불확실성에 민감하며, 두 작업의 경계가 항상 명확한 것은 아니다.
---

## 반대 작업을 함께 배우기

SOD는 시선을 끄는 객체를 찾고, COD는 주변에 숨어 눈에 띄지 않는 객체를 찾는다. 표면적으로는 정반대다. 이 논문은 바로 그 대조가 좋은 학습 신호라고 본다. 두드러짐과 위장을 별개의 데이터셋 이름으로 나누기보다, **객체와 배경 사이의 시각적 대비가 연속적으로 변하는 문제**로 해석한다.

특히 COD 데이터 안에도 비교적 쉽게 보이는 객체가 있다. 저자들은 이런 샘플을 SOD 관점에서는 어려운 양성으로 간주한다. SOD 모델이 뚜렷한 객체만 찾는 습관을 줄이는 동시에, COD 모델은 salient cue가 약해지는 지점을 더 선명하게 배울 수 있다.

## 공동 학습의 세 단계

첫 단계는 샘플 재사용이다. 쉬운 COD 양성을 SOD 학습에 넣어 salient detector의 결정 경계를 넓힌다. 단순히 두 데이터셋을 합치면 작업 정체성이 흐려질 수 있으므로, 두 번째로 **similarity measure module**을 두어 SOD와 COD 특징의 공통점과 상반된 속성을 명시적으로 측정한다.

세 번째는 uncertainty-aware adversarial learning이다. 두 데이터셋의 라벨은 항상 완벽하지 않고, SOD와 COD의 경계에 놓인 장면은 어느 쪽으로도 단정하기 어렵다. adversarial 학습을 이용해 더 높은 수준의 작업 관계를 맞추는 동시에 네트워크의 confidence를 추정한다. 불확실한 샘플을 무조건 확정적인 정답처럼 밀어붙이지 않으려는 장치다.

## 무엇이 흥미로운가

이 설계의 강점은 보조 작업을 임의로 붙이지 않았다는 데 있다. SOD와 COD는 출력 형태가 모두 이진 분할이라 아키텍처를 공유하기 쉽고, 시각적 대비라는 공통 축에서 서로 다른 난도를 제공한다. 한 작업의 쉬운 샘플이 다른 작업의 hard positive가 된다는 관찰도 데이터 효율 측면에서 설득력이 있다.

또한 공동 학습은 “위장 객체 전용 특징”이 실제로 존재하는지 생각하게 한다. 경계, 지역 대비, 전역 문맥 같은 단서는 두 작업 모두 필요하고, 중요한 것은 어떤 조건에서 그 단서를 신뢰할지일 수 있다.

## 실험에서 확인할 부분

논문은 SOD와 COD의 여러 벤치마크에서 각각 단독 모델보다 공동 학습 모델이 개선된다고 보고한다. 수치보다 먼저 봐야 할 것은 한쪽 성능을 희생해 다른 쪽만 올린 것이 아닌지다. 결과는 두 작업 모두에서 이득을 보여 상반된 정보의 공유가 단순한 타협은 아니라는 근거를 제공한다.

절제 실험에서는 COD 샘플 재사용, similarity modeling, uncertainty-aware adversarial component가 순차적으로 기여하는지를 확인한다. 공동 학습 논문은 데이터 양이 늘어난 효과와 구조의 효과가 섞이기 쉬우므로, 이런 분해가 특히 중요하다.

## 오늘의 관점에서 읽기

최근 foundation model은 하나의 백본으로 여러 분할 작업을 다룬다. 이 논문은 그보다 앞서 **작업 사이의 모순을 제거하지 말고 감독 신호로 사용하라**는 방향을 보여준다. prompt나 task token만 바꾸는 모델에서도 SOD와 COD가 무엇을 공유하고 어디서 갈라지는지 분석할 때 좋은 기준이 된다.

내가 가져갈 아이디어는 hard positive의 재정의다. 새로운 데이터를 만들지 않아도, 한 작업의 쉬운 예시를 다른 작업의 어려운 예시로 재배치하면 결정 경계를 풍부하게 만들 수 있다.

## 조심해서 볼 지점

salient와 camouflaged는 완전한 이분법이 아니다. 한 장면에서도 관찰자, 크롭, 해상도에 따라 객체가 두드러져 보일 수 있다. 데이터셋별 촬영 스타일이나 배경 편향을 작업 차이로 오인할 위험도 있다. 불확실성 추정이 이런 분포 차이까지 제대로 반영하는지, 새로운 데이터셋에서도 같은 공동 학습 이득이 유지되는지는 별도 검증이 필요하다.
