---
title: Feature Shrinkage Pyramid for Camouflaged Object Detection with Transformers
description: FSPNet은 NL-TEM으로 인접 token의 고차 관계를 강화하고, AIM을 포함한 Feature Shrinkage Decoder가 이웃 transformer feature를
  층별로 모은다.
summary: FSPNet은 NL-TEM으로 인접 token의 고차 관계를 강화하고, AIM을 포함한 Feature Shrinkage Decoder가 이웃 transformer feature를 층별로
  모은다.
subtitle: transformer의 전역 문맥은 유지하되 부족한 locality와 느슨한 decoder aggregation을 보완하기 위해, 이웃 token 관계를 강화하고 인접 단계 특징을 점진적으로
  축소·집약한 FSPNet.
pubDate: 2026-03-15 09:00:00 +0900
slug: fspnet-transformer-cod-cvpr2023
kind: paper
lang: ko
tags:
- paper
- cod
- transformer
- feature-pyramid
- cvpr-2023
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html
venue: CVPR 2023
paperYear: 2023
authors: Zhou Huang, Hang Dai, Tian-Zhu Xiang, Shuo Wang, Huai-Xin Chen, Jie Qin, Huan Xiong
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf
codeUrl: https://github.com/ZhouHuang23/FSPNet
takeaways:
- transformer가 전역 관계에 강하다고 해서 COD에 필요한 미세한 locality까지 자동으로 확보되는 것은 아니라고 본다.
- NL-TEM은 이웃 token과 고차 관계를 보강하고, FSD는 인접 계층 특징을 progressive shrinking으로 누적한다.
- 복잡한 decoder가 실제 backbone 개선보다 얼마나 기여하는지는 파라미터·연산량을 맞춘 비교로 봐야 한다.
---

## transformer의 강점이 곧 COD의 해답은 아니다

vision transformer는 멀리 떨어진 영역을 연결하는 데 강하다. 위장 객체의 일부가 배경에 묻혀도 다른 부분과 전역 형태를 참조할 수 있으니 COD와 잘 맞아 보인다. 그러나 patch token은 CNN의 촘촘한 지역 inductive bias가 약하고, 일반적인 decoder는 여러 계층의 미세 단서를 충분히 모으지 못할 수 있다.

FSPNet은 이 두 약점을 분리해 다룬다. encoder 쪽에서는 token의 지역 표현을 보강하고, decoder 쪽에서는 인접 계층 특징을 한 번에 점프해 합치지 않고 **점진적으로 줄여 가며 축적**한다.

## NL-TEM: 이웃을 다시 보게 하기

**Non-Local Token Enhancement Module(NL-TEM)**은 이름과 달리 단순 전역 attention의 반복이 아니다. 인접 token 사이의 상호작용을 강화하면서 graph-style high-order relation을 탐색해, transformer token 안에 지역 구조를 다시 넣는다.

위장 장면에서 경계는 한 픽셀의 큰 대비가 아니라 주변 패턴의 작은 불연속으로 드러나는 경우가 많다. 토큰이 넓은 장면 의미만 담고 가까운 질감 변화를 희석하면 이 단서를 놓친다. NL-TEM은 이웃 관계를 명시해 작은 불연속이 전역 문맥 속에서도 사라지지 않도록 한다.

## Feature Shrinkage Decoder

일반 pyramid decoder는 서로 다른 해상도의 특징을 upsample해 한 번에 합치는 경우가 많다. FSPNet의 **Feature Shrinkage Decoder(FSD)**는 adjacent interaction module을 통해 서로 이웃한 transformer stage를 먼저 상호작용시키고, 계층을 따라 공간·채널 표현을 점진적으로 축소한다.

‘shrinkage’는 정보를 버리기 위한 압축이라기보다, 여러 계층에 흩어진 약한 단서를 단계마다 응축하는 과정에 가깝다. 깊은 특징의 객체 의미와 얕은 특징의 경계를 갑자기 결합하지 않고, 중간 표현을 거치며 의미 차이를 좁힌다.

## 실험에서 확인할 주장

논문은 세 COD benchmark와 여러 평가 지표에서 폭넓은 기존 방법을 비교한다. 구조의 타당성을 보려면 최고 점수보다 세 가지를 확인해야 한다. transformer backbone만 바꾼 baseline 대비 이득, NL-TEM만 추가했을 때의 변화, shrinkage decoder가 일반 decoder보다 주는 추가 이득이다.

정성 결과에서는 복잡한 배경 속 작은 객체와 끊긴 윤곽이 중요하다. 전역 attention만으로도 큰 객체 내부는 채울 수 있지만, FSPNet이 주장하는 locality 보강은 가는 다리·날개·잎 경계에서 드러나야 한다.

## 이 논문의 위치

FSPNet은 “CNN인가 transformer인가”라는 선택보다 **transformer에 어떤 locality를 다시 주입할 것인가**가 중요하다는 사례다. 이후에는 convolution adapter, deformable attention, window attention 등 더 다양한 방식이 등장하지만 목적은 비슷하다.

decoder 설계도 의미가 있다. 강한 pretrained encoder를 사용해도 dense prediction에서는 계층 특징을 어떻게 복원하느냐가 성능을 크게 좌우한다. 특히 COD처럼 객체 단서가 여러 해상도에 조금씩 흩어진 문제에서는 한 번의 fusion보다 단계적 aggregation이 합리적이다.

## 비판적으로 볼 부분

NL-TEM과 FSD가 모두 여러 관계 연산을 추가하므로, 개선이 설계 원리 때문인지 단순 용량 증가 때문인지 구분해야 한다. 입력 크기와 backbone, 학습 schedule, 파라미터와 FLOPs를 맞춘 baseline이 중요하다. 또한 locality를 강화한 모델이 새로운 배경 질감에서 더 일반화하는지, 아니면 훈련 데이터의 국소 패턴을 더 잘 외우는지는 별도 평가가 필요하다.
