---
title: Unsupervised Domain-Adaptive SAR Ship Detection Based on Cross-Domain Feature Interaction and Data Contribution Balance
description: 광학 영상에서 배운 선박 검출기를 SAR로 옮기기 위해, 영상 변환·특징 추출·작은 선박 강화·샘플 가중의 네 지점을 함께 손본다.
pubDate: 2024-02-19 19:05:32 +0900
category: paper-review
tags: [sar, domain-adaptation, object-detection, remote-sensing]
takeaways:
  - SAR 영상은 영상 형성 원리가 복잡하고 다양한 각도·조건의 실제 데이터가 부족해, 기존 딥러닝 검출기의 일반화가 크게 제한된다.
  - CycleGAN-SCA로 두 도메인의 간극을 줄이고, 셀프 어텐션 백본과 경량 넥으로 복잡한 배경과 작은 선박 문제를 보완한다.
  - 품질이 다른 샘플의 영향을 맞추는 E12IoU 손실을 더해, 자체 구축한 광학-SAR 데이터셋에서 mAP 68.54%를 기록했다.
paper:
  title: Unsupervised Domain-Adaptive SAR Ship Detection Based on Cross-Domain Feature Interaction and Data Contribution Balance
  authors: Yanrui Yang, Jie Chen, Long Sun, Zheng Zhou, Zhixiang Huang, Bocai Wu
  venue: Remote Sensing 2024
  year: 2024
  url: https://www.mdpi.com/2072-4292/16/2/420
  pdf: https://www.mdpi.com/2072-4292/16/2/420/pdf
origin:
  name: Tistory
  url: https://jms3084.tistory.com/42
---

## 문제

SAR 선박 영상은 라벨을 다는 데 전문 지식과 시간이 많이 든다. 반면 광학 영상에는 비교적 풍부한 선박 데이터가 있다. 자연스럽게 광학 도메인에서 배운 지식을 라벨 없는 SAR 영상으로 옮기고 싶어지지만, 두 센서의 차이는 날씨나 색감 차이보다 훨씬 크다. 광학 영상은 반사된 가시광을, SAR은 전자기파의 산란 응답을 기록한다. 모양이 같은 선박도 밝기 구조와 배경 통계가 전혀 다르게 나타난다.

여기에 SAR 영상의 복잡한 영상 형성 원리와, 다양한 각도·파라미터로 찍은 실제 데이터의 부족이 겹쳐 기존 딥러닝 SAR 검출기의 일반화 성능은 크게 제한된다.

## 방법

하나의 정렬 손실로 전체 간극을 줄이려 하지 않고, 네 지점을 나눠 손본다.

### 도메인 간 영상 생성: CycleGAN-SCA

새로 설계한 영상 생성 모듈 **CycleGAN-SCA**로 광학 영상을 SAR에 가까운 외형으로 바꿔, 원본 도메인과 목표 도메인의 간극을 줄인다. 이때 중요한 것은 SAR처럼 보이는지보다, 변환 뒤에도 선박의 위치·크기·방향이 유지되어 **기존 박스 라벨이 여전히 유효한지**다.

### 셀프 어텐션 백본

복잡한 해상 배경의 영향을 줄이기 위해, 셀프 어텐션으로 특징 표현력을 끌어올린 새 백본을 설계했다.

### 경량 특징 융합·강화 넥

작은 선박은 해상도가 낮고 특징이 적으며 정보가 쉽게 손실된다. 이를 위해 가벼운 특징 융합·강화 넥을 새로 설계했다.

### 데이터 기여 균형: E12IoU 손실

품질이 다른 샘플들이 모델에 미치는 영향을 맞추기 위해, 간단하고 효율적인 **E12IoU 손실**을 만들었다. 모든 샘플을 같은 비중으로 믿지 않으려는 장치다.

## 실험

자체 구축한 대규모 광학-SAR 도메인 간 검출 데이터셋에서 기존 도메인 간 방법들보다 좋은 성능을 냈고, mAP는 68.54%였다. 목표 도메인 라벨을 5%만 쓰는 설정에서도 기준 모델보다 6.27% 향상됐다.

## 정리

광학→SAR 전이를 하나의 기술로 줄이지 않고 영상 외형, 특징 표현, 작은 객체, 샘플 신뢰도를 각각 다룬 점이 이 논문의 장점이다. 반면 구성 요소가 많아서, 향상이 도메인 적응 덕분인지 더 강한 검출기 구조 덕분인지 구분하려면 백본·넥·손실을 하나씩 더한 절제 실험을 꼼꼼히 봐야 한다.

자체 구축 데이터셋 기준의 결과이므로, 다른 SAR 센서나 해역에서 같은 이득이 유지되는지는 따로 검증이 필요하다.
