---
title: 'Beyond Single Images: Retrieval Self-Augmented Unsupervised Camouflaged Object Detection'
description: RISE는 annotation 없이 dataset-level prototype library를 만들고, Clustering-then-Retrieval과 Multi-View KNN
  Retrieval로 더 안정적인 pseudo mask를 생성한다.
summary: RISE는 annotation 없이 dataset-level prototype library를 만들고, Clustering-then-Retrieval과 Multi-View KNN Retrieval로
  더 안정적인 pseudo mask를 생성한다.
subtitle: 한 이미지 안의 cue만으로 pseudo label을 만들지 않고, 전체 training set에서 환경·객체 prototype을 구축해 KNN으로 검색하며 서로의 약한 단서를 보완하는
  RISE.
pubDate: 2026-04-02 09:00:00 +0900
slug: rise-unsupervised-cod
kind: paper
lang: ko
tags:
- paper
- unsupervised-cod
- retrieval
- prototype-learning
- iccv-2025
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2025/html/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.html
venue: ICCV 2025
paperYear: 2025
authors: Ji Du, Xin Wang, Fangwei Hao, Mingyang Yu, Chunyuan Chen, Jiesheng Wu, Bin Wang, Jing Xu, Ping Li
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2025/papers/Du_Beyond_Single_Images_Retrieval_Self-Augmented_Unsupervised_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
codeUrl: https://github.com/xiaohainku/RISE
takeaways:
- 개별 이미지의 불확실한 foreground cue를 training set 전체의 반복 환경·객체 패턴으로 보완한다.
- CR이 coarse clustering과 filtering으로 prototype을 정리하고, MVKR이 여러 view의 KNN 결과를 합쳐 artifact를 줄인다.
- dataset 전체를 참조하는 transductive retrieval의 범위와 test-time 정보 사용 여부를 명확히 해야 공정하다.
---

## 한 장만 보면 단서가 너무 약하다

unsupervised COD는 보통 각 이미지 안에서 saliency, edge, foundation feature를 이용해 pseudo mask를 만든다. 위장 객체가 그 이미지에서 거의 보이지 않으면 복구할 외부 근거가 없다. RISE는 training dataset 전체를 **상호 참조 가능한 기억**으로 사용한다.

비슷한 환경이나 객체가 다른 이미지에서는 조금 더 잘 드러날 수 있다. 개별 샘플의 약한 신호를 dataset-level context와 retrieval로 보강한다는 아이디어다.

## 두 prototype library

RISE는 annotation 없이 environment prototype과 camouflaged object prototype library를 만든다. environment library는 반복되는 배경 패턴을, object library는 여러 이미지에서 공통적으로 나타나는 foreground 후보를 담는다. 각 이미지 feature는 두 library와 KNN matching되어 pixel별 pseudo mask를 얻는다.

이 접근은 EASE의 environment-first 관점을 객체 prototype까지 확장한다. background와 foreground를 모두 retrieval space에 놓아 어느 쪽과 더 가까운지 상대적으로 판단한다.

## Clustering-then-Retrieval

GT가 없으면 초기 library에 배경 artifact와 잘못된 객체 후보가 많이 들어간다. **CR strategy**는 먼저 coarse mask를 clustering으로 만들고, histogram 기반 image filtering과 cross-category retrieval을 이용해 더 높은 confidence의 prototype을 고른다.

바로 KNN을 수행하기 전에 library를 정제하는 단계다. 같은 image 안의 self-confirmation을 줄이고, 서로 다른 category에서도 반복되는 진짜 environment/object pattern을 찾는다. prototype purity가 이후 모든 pseudo mask 품질을 좌우한다.

## Multi-View KNN Retrieval

foundation feature map에는 patch artifact, 특정 crop과 scale의 편향이 생길 수 있다. **MVKR**은 원본 한 view의 nearest neighbor만 믿지 않고 여러 augmentation 또는 representation view에서 retrieval한 결과를 합친다. 여러 관점에서 일치하는 영역은 confidence를 높이고 한 view에만 나타난 artifact는 약화한다.

이는 pseudo-label ensemble과 비슷하지만, prediction probability가 아니라 retrieval neighborhood의 안정성을 이용한다. 최종 mask는 이렇게 생성된 pseudo label로 일반 COD model을 학습하는 데 사용된다.

## 실험에서 확인할 경계

논문은 unsupervised와 prompt-based 방법보다 높은 결과를 보고한다. 하지만 dataset-level retrieval은 single-image baseline보다 더 많은 target distribution 정보를 본다. library 구축에 train image만 쓰는지, test image가 retrieval pool에 들어가는지, image별 split을 엄격히 지키는지 명시해야 한다.

CR 없는 raw library, single-view KNN, object-only와 environment-only library를 비교하면 각 요소의 기여를 알 수 있다. category imbalance와 rare object에서 neighbor가 부족할 때의 실패도 중요하다.

## 장점과 위험

RISE는 annotation 대신 데이터 자체의 중복성과 문맥을 자원으로 쓴다. large unlabeled collection이 있는 실제 환경에서 매력적이며, retrieval 결과를 시각화해 pseudo mask의 근거를 어느 정도 추적할 수 있다.

반면 dataset bias를 강하게 활용한다. 비슷한 배경이 반복되면 잘 작동하지만 완전히 새로운 environment나 singleton object에서는 잘못된 neighbor가 오히려 해를 준다. library 업데이트 비용, KNN 검색 지연, privacy-sensitive 이미지 간 feature 공유도 배포 시 고려해야 한다.
