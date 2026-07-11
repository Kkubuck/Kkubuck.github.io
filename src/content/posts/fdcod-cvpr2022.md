---
title: Detecting Camouflaged Object in Frequency Domain
description: FDCOD은 DCT 기반 Frequency Enhancement Module, RGB–frequency feature alignment, High-Order Relation Module을
  결합해 공간 영역 밖의 단서를 적극적으로 사용한다.
summary: FDCOD은 DCT 기반 Frequency Enhancement Module, RGB–frequency feature alignment, High-Order Relation Module을
  결합해 공간 영역 밖의 단서를 적극적으로 사용한다.
subtitle: RGB 공간에서 거의 사라지는 객체·배경 차이를 DCT 주파수 단서에서 다시 찾고, 공간 특징과 정렬해 고차 관계로 해석한 frequency-aware COD 연구.
pubDate: 2026-03-13 09:00:00 +0900
slug: fdcod-cvpr2022
kind: paper
lang: ko
tags:
- paper
- cod
- frequency-domain
- feature-fusion
- cvpr-2022
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2022/html/Zhong_Detecting_Camouflaged_Object_in_Frequency_Domain_CVPR_2022_paper.html
venue: CVPR 2022
paperYear: 2022
authors: Yijie Zhong, Bo Li, Lv Tang, Senyun Kuang, Shuang Wu, Shouhong Ding
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2022/papers/Zhong_Detecting_Camouflaged_Object_in_Frequency_Domain_CVPR_2022_paper.pdf
codeUrl: https://github.com/luckybird1994/FDCOD
takeaways:
- RGB 값이 비슷해도 질감의 주기와 경계 변화는 주파수 표현에서 다르게 드러날 수 있다는 가설을 세운다.
- DCT 뒤의 learnable enhancement와 feature alignment로 frequency cue를 CNN 표현에 통합한다.
- 주파수 단서가 데이터 압축·해상도·센서 변화에도 안정적인지에 대한 검증은 별도로 필요하다.
---

## RGB 밖에서 차이를 찾기

위장 객체는 사람의 눈에 보이는 색과 밝기를 배경에 맞춘다. 그렇다고 두 영역의 모든 통계가 같은 것은 아니다. 털, 비늘, 잎, 모래는 비슷한 색을 가져도 미세한 반복 패턴과 경계 변화의 빈도가 다를 수 있다. FDCOD은 이 차이를 **frequency domain**에서 찾는다.

논문의 주장은 도발적이다. COD의 목표를 인간의 RGB 지각을 모방하는 데 두지 말고, 사람이 직접 보기 어려운 표현까지 이용해 생물학적 시각을 넘어가자는 것이다. 주파수 단서를 보조적인 전처리가 아니라 네트워크의 주요 분기로 끌어온다.

## Frequency Enhancement Module

입력 특징에 offline DCT(Discrete Cosine Transform)를 적용하면 공간 패턴이 여러 주파수 성분으로 분해된다. 낮은 주파수는 넓은 밝기와 형태 변화를, 높은 주파수는 빠른 질감 변화와 경계를 더 많이 담는다. 하지만 DCT 결과를 그대로 사용하면 어떤 대역이 COD에 유용한지 알 수 없다.

**Frequency Enhancement Module(FEM)**은 변환된 성분을 learnable하게 조정해 위장 객체를 구분하는 대역을 강조한다. 저자들은 frequency loss도 더해 네트워크가 주파수 신호를 무시하고 RGB 분기만 사용하는 것을 막는다. 즉 표현과 학습 목표 양쪽에서 frequency cue의 존재감을 확보한다.

## 두 도메인을 다시 맞추기

RGB 특징과 주파수 특징은 값의 분포와 의미가 다르다. 단순 연결은 한쪽이 다른 쪽을 압도하거나 위치 대응을 흐릴 수 있다. FDCOD은 **feature alignment**로 두 도메인의 표현을 맞춘 뒤 융합한다.

융합 특징은 **High-Order Relation(HOR) Module**로 전달된다. 특정 픽셀의 주파수 값만 보는 대신, 장면 여러 위치와 채널 사이의 관계를 모델링해 진짜 객체 단서와 배경의 무작위 고주파를 구분하려는 단계다. 주파수는 압축 노이즈나 잔가지에도 강하게 반응하므로 관계 추론이 중요하다.

## 실험에서 얻는 근거

논문은 COD10K, CAMO, CHAMELEON에서 다수의 기존 방법과 비교하고, RGB-only baseline에 FEM, alignment, HOR를 차례로 추가한 절제 결과를 제시한다. 일관된 개선은 frequency branch가 단순 파라미터 증가 이상의 신호를 제공한다는 근거가 된다.

정성 결과에서는 객체 내부의 약한 질감 차이와 경계가 복원되는 사례가 중요하다. 반면 매우 부드러운 객체나 JPEG artifact가 강한 이미지처럼 frequency cue가 혼란스러운 조건도 함께 살펴야 한다. 평균 지표만으로 어떤 주파수 대역이 실제로 작동했는지는 알기 어렵다.

## 이후 흐름에서의 위치

FDCOD 이후 COD에서 wavelet, Fourier, frequency–spatial interaction을 전면에 내세운 연구가 이어졌다. 이 논문은 그 출발점 중 하나다. 구현은 DCT와 CNN 모듈이지만, 더 일반적인 메시지는 **공간적으로 비슷한 두 영역을 다른 기저로 투영하면 분리 가능한 단서가 생길 수 있다**는 것이다.

이 아이디어는 원격탐사나 의료 영상처럼 센서 특유의 주파수 패턴이 있는 도메인에도 매력적이다. 다만 학습 데이터의 촬영 장비나 압축 방식 자체를 객체 단서로 외우지 않는지 확인해야 한다.

## 한계와 다음 질문

offline DCT는 고정된 변환이므로 과업에 최적인 기저라고 보장할 수 없다. 해상도 변경, 블러, 압축, 다른 센서가 주파수 분포를 바꾸면 성능이 흔들릴 수 있다. 주파수 분기의 계산 비용과 RGB 분기와의 중복도 있다. 후속 연구에서는 learnable transform이 실제 일반화를 높이는지, 대역별 attribution이 의미 있는지, 도메인 이동에서 frequency cue가 안정적인지를 검증할 필요가 있다.
