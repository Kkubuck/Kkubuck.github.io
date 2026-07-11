---
title: 'Unsupervised Domain Adaptation Based on Progressive Transfer for Ship Detection: From Optical to SAR Images'
description: 광학→SAR의 큰 간극을 픽셀·특징·예측 단계로 순차 축소하고, 마지막에는 robust self-training으로 target 표현을 직접 학습한다.
summary: 광학→SAR의 큰 간극을 픽셀·특징·예측 단계로 순차 축소하고, 마지막에는 robust self-training으로 target 표현을 직접 학습한다.
subtitle: 광학→SAR의 큰 간극을 픽셀·특징·예측 단계로 순차 축소하고, 마지막에는 robust self-training으로 target 표현을 직접 학습한다.
pubDate: 2024-02-19 19:07:03 +0900
slug: tistory-43
kind: paper
lang: ko
tags:
- paper
- domain-adaptation
- sar
- ship-detection
- self-training
categories:
- papers
sourceUrl: https://ieeexplore.ieee.org/document/9803220
sourceBlog: tistory
legacyUrl: https://jms3084.tistory.com/43
venue: IEEE TGRS 2022
paperYear: 2022
authors: Yu Shi, Lan Du, Yuchen Guo, Yuang Du
reviewedOn: '2026-07-10'
doi: 10.1109/TGRS.2022.3185298
takeaways:
- 광학과 SAR처럼 간극이 큰 도메인은 한 번에 정렬하기보다 중간 도메인을 거치는 편이 안정적이다.
- 픽셀 변환, adversarial feature alignment, robust self-training이 서로 다른 종류의 차이를 담당한다.
- 마지막 성능은 pseudo-label 품질에 크게 의존하므로 오류가 누적되는 조건을 함께 봐야 한다.
---

## 한 번에 건너기에는 너무 먼 도메인

광학 선박 영상과 SAR 선박 영상은 같은 대상을 다루지만 관측 방식이 다르다. 색·텍스처의 차이뿐 아니라 배경 잡음과 산란 패턴, 객체 내부 밝기 구조가 달라진다. 일반적인 도메인 적응처럼 source와 target feature를 바로 맞추면, 검출에 필요한 클래스 구조까지 함께 무너질 수 있다.

이 논문은 전이를 세 단계로 나눈다. 입력 외형을 먼저 가까이 만들고, 그다음 특징 분포를 정렬한 뒤, 마지막에는 target 영상에서 얻은 예측을 이용해 검출기를 직접 적응시킨다. “progressive”라는 이름은 단순한 학습 스케줄이 아니라 서로 다른 수준의 간극을 순서대로 줄인다는 뜻이다.

## 픽셀 수준: 전이 도메인 만들기

첫 단계에서는 GAN 기반 생성기에 skip connection을 넣고, 선박을 고려한 데이터 증강을 사용해 광학 영상에서 SAR에 가까운 transition domain을 만든다. 이 중간 영상은 target SAR을 완벽하게 모사할 필요는 없다. source와 target 사이에서 검출기가 형태 정보를 잃지 않고 이동할 수 있는 디딤돌이면 된다.

여기서 가장 중요한 검증은 변환 전후의 bounding box가 여전히 유효한가이다. 배경 스타일이 그럴듯해도 선박 윤곽이나 크기가 변형되면 source label을 사용할 근거가 사라진다.

## 특징 수준: 도메인 불변 표현

두 번째 단계는 adversarial alignment다. 도메인 판별기가 source와 target feature를 구분하지 못하도록 detector의 feature extractor를 학습한다. 목표는 센서 고유 통계보다 선박 검출에 필요한 구조를 남기는 것이다.

다만 전역 분포를 지나치게 맞추면 서로 다른 클래스나 배경 패턴이 잘못 정렬될 수 있다. 이 논문에서 픽셀 변환을 먼저 수행하는 이유도 feature alignment가 감당해야 할 거리를 줄이기 위해서다.

## 예측 수준: Robust Self-Training

feature-aligned detector로 target SAR 영상의 pseudo-label을 만들고, 이를 이용해 target 특징을 직접 학습한다. 문제는 초기 오검출이 학습을 통해 강화될 수 있다는 점이다. 저자들은 robust self-training을 손실 최소화 문제로 구성해 noisy pseudo-label의 영향을 줄이려 한다.

self-training의 효과를 볼 때는 confidence threshold 하나만 확인해서는 부족하다. 작은 선박이 낮은 confidence로 계속 제외되는지, 해안 구조물이 높은 confidence의 false positive로 누적되는지 같은 클래스·크기별 편향을 살펴야 한다.

## 세 단계가 서로 필요한 이유

픽셀 변환만 사용하면 생성기의 artifact에 의존하고, feature alignment만 사용하면 큰 센서 간극 때문에 의미 구조가 흔들릴 수 있다. self-training만 사용하면 초기 pseudo-label이 약하다. 세 단계는 앞 단계가 다음 단계의 입력 난도를 낮추는 관계다. 따라서 ablation도 각 모듈의 독립 점수보다 순서를 바꾸거나 일부 단계를 제거했을 때의 안정성을 보는 편이 중요하다.

## 읽고 남은 판단

이 논문은 큰 도메인 간극을 한 번의 정렬로 해결하려 하지 않는다는 점에서 설득력이 있다. 실제 적용에서는 새로운 SAR 센서나 해역으로 바뀔 때 생성기와 confidence 기준이 얼마나 민감한지 추가 검증이 필요하다. 그럼에도 픽셀–특징–예측을 순차적으로 연결한 틀은 cross-modality detection을 정리하는 좋은 기준점이다.
