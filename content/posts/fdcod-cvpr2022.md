---
title: Detecting Camouflaged Object in Frequency Domain
description: 사람 눈으로 보는 RGB 영역을 넘어, 이산 코사인 변환(DCT)으로 얻은 주파수 정보를 위장 객체 탐지의 추가 단서로 쓴다.
pubDate: 2026-03-13 09:00:00 +0900
category: paper-review
tags: [cod, frequency]
takeaways:
  - COD의 목표는 사람의 시각을 흉내 내는 데서 그치지 않고 넘어서는 것이라고 보고, 주파수 영역을 추가 단서로 도입한다.
  - 오프라인 DCT와 학습 가능한 강화로 이루어진 FEM이 주파수 단서를 캐고, 특징 정렬로 RGB와 주파수 특징을 합친다.
  - 합쳐진 특징의 풍부한 관계는 고차 관계 모듈(HOR)로 다룬다.
paper:
  title: Detecting Camouflaged Object in Frequency Domain
  authors: Yijie Zhong, Bo Li, Lv Tang, Senyun Kuang, Shuang Wu, Shouhong Ding
  venue: CVPR 2022
  year: 2022
  url: https://openaccess.thecvf.com/content/CVPR2022/html/Zhong_Detecting_Camouflaged_Object_in_Frequency_Domain_CVPR_2022_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2022/papers/Zhong_Detecting_Camouflaged_Object_in_Frequency_Domain_CVPR_2022_paper.pdf
---

## 문제

위장 객체는 사람의 눈으로도 찾기 어렵다. 그래서 저자들은 COD의 목표가 RGB 영역에서 사람의 시각 능력을 흉내 내는 데 있지 않고, **생물학적 시각을 넘어서는 것**이어야 한다고 주장한다. 그 수단으로 고른 것이 주파수 영역이다. RGB로는 배경과 구분되지 않는 위장 객체도, 주파수 성분으로 보면 질감의 미묘한 차이가 드러날 수 있다.

## 방법

주파수 단서를 CNN에 잘 넣기 위해 두 가지 구성 요소를 설계했다.

### Frequency Enhancement Module (FEM)

입력 이미지에 오프라인 **이산 코사인 변환**(DCT)을 적용해 주파수 성분을 얻고, 그 뒤에 **학습 가능한 강화** 과정을 붙여 위장 객체의 단서를 캔다. 변환 자체는 고정된 연산이고, 어떤 주파수 성분을 강조할지는 학습으로 정한다.

### 특징 정렬과 고차 관계 모듈 (HOR)

RGB 영역의 특징과 주파수 영역의 특징은 성격이 달라서 바로 더하기 어렵다. 먼저 특징 정렬(feature alignment)로 두 영역의 특징을 맞춰 합친다. 이어서 합쳐진 특징의 풍부한 정보를 충분히 쓰기 위해 **고차 관계 모듈**(high-order relation module, HOR)을 둔다.

## 실험

널리 쓰이는 세 COD 데이터셋에서 기존 최고 성능 방법들을 큰 폭으로 앞섰다고 보고했다.

## 정리

주파수 정보를 COD의 **추가 입력 단서**로 본격적으로 쓴 초기 연구다. 이후 FEDER(학습 가능한 웨이블릿), FSEL(주파수-공간 얽힘 학습)처럼 주파수 영역을 활용하는 COD 연구가 이어졌으므로, 그 흐름의 출발점으로 읽으면 좋다.

DCT로 얻는 주파수 정보는 영상의 압축 흔적이나 해상도에도 민감할 수 있으므로, 다른 촬영 조건에서의 일반화는 주의해서 볼 부분이다. 논문 초록에 적힌 공식 코드 저장소는 현재 열리지 않는다.
