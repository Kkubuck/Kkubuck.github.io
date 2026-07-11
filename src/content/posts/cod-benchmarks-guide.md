---
title: 'COD 벤치마크를 읽는 법: 데이터셋, 지표, 비교 체크리스트'
description: COD 논문의 표를 그대로 비교하기 전에 데이터 분할, backbone, 입력 크기, 추가 supervision과 metric의 성격을 확인하는 실전 가이드.
summary: COD 논문의 표를 그대로 비교하기 전에 데이터 분할, backbone, 입력 크기, 추가 supervision과 metric의 성격을 확인하는 실전 가이드.
subtitle: CHAMELEON·CAMO·COD10K·NC4K의 역할과 표준 학습 분할, S-measure·E-measure·weighted F-measure·MAE가 각각 무엇을 보는지 정리한 실험
  읽기 노트.
pubDate: 2026-03-25 09:00:00 +0900
slug: cod-benchmarks-guide
kind: paper
lang: ko
tags:
- guide
- cod
- benchmark
- dataset
- evaluation
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content_CVPR_2020/html/Fan_Camouflaged_Object_Detection_CVPR_2020_paper.html
venue: Benchmark Guide
paperYear: 2026
authors: Kkubuck · dataset sources cross-checked with official papers
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content_CVPR_2020/papers/Fan_Camouflaged_Object_Detection_CVPR_2020_paper.pdf
codeUrl: https://github.com/DengPingFan/SINet
takeaways:
- 표준 학습은 대개 CAMO 1,000장과 COD10K 3,040장을 합치고, 네 테스트셋은 규모와 분포 역할이 다르다.
- 구조·정렬·픽셀 오류를 보는 지표가 서로 달라 한 숫자만으로 모델 품질을 판단하면 안 된다.
- backbone, 입력 해상도, 외부 데이터, pretrained foundation model, post-processing가 다르면 같은 표의 수치도 공정 비교가 아니다.
---

## 먼저 실험 프로토콜을 고정한다

COD 논문 표는 비슷해 보여도 학습 데이터와 입력 설정이 다르면 직접 비교하기 어렵다. 가장 흔한 supervised protocol은 **CAMO-Train 1,000장 + COD10K-Train 3,040장**을 학습에 사용하고, CHAMELEON, CAMO-Test, COD10K-Test, NC4K에서 평가하는 방식이다.

최근에는 ImageNet pretraining뿐 아니라 SAM, CLIP, depth model, 합성 데이터, box·point prompt를 사용한다. 이들은 모두 추가 supervision 또는 외부 지식이다. “같은 training set”이라는 문장만 보고 동일 조건이라 판단하면 안 된다.

## 네 데이터셋의 역할

### CHAMELEON

76장의 수작업 마스크로 구성된 작은 테스트셋이다. 인터넷 검색으로 모은 위장 동물 중심이며 훈련에는 보통 쓰지 않는다. 샘플 수가 작아 몇 장의 성공·실패가 평균을 크게 바꿀 수 있다. 빠른 sanity check에는 유용하지만, 이 데이터셋 하나의 최고 점수를 일반화 근거로 삼기 어렵다.

### CAMO

위장 객체 이미지 1,250장 가운데 1,000장을 학습, 250장을 테스트에 사용한다. 초기 COD 연구의 핵심 데이터셋으로 장면이 어렵고 경계가 모호한 사례가 많다. 원 데이터에는 non-camouflaged 비교 이미지도 있지만, 표준 COD 분할에서는 camouflaged subset을 주로 사용한다.

### COD10K

camouflaged subset은 총 5,066장으로, 3,040장 train과 2,026장 test로 나뉜다. category와 장면 다양성이 커 표준 학습의 중심이 된다. 이름의 ‘10K’는 전체 수집 구성과 관련되어 있어, 실제 COD train/test 장수를 10,000장으로 오해하지 않는 편이 좋다.

### NC4K

4,121장의 큰 test-only benchmark다. 기존 train set으로 학습한 모델이 더 다양한 인터넷 장면으로 일반화하는지 보기 위해 제안되었다. 크기가 큰 만큼 평균이 안정적이지만, 웹 수집 데이터의 중복과 촬영 편향 가능성은 여전히 점검 대상이다.

## 지표는 서로 다른 실패를 본다

**MAE**는 예측 확률과 binary mask의 픽셀별 절대 차이를 평균낸다. 직관적이지만 객체 크기와 구조를 충분히 반영하지 못한다. 큰 배경을 모두 낮게 예측하면 작은 객체를 놓쳐도 값이 좋아 보일 수 있다.

**F-measure**는 precision과 recall의 균형을 본다. COD에서는 threshold에 따른 maximum 또는 mean F와, 공간적 중요도를 반영한 **weighted F-measure**가 자주 쓰인다. false positive와 false negative의 균형은 보이지만 형태가 얼마나 자연스러운지는 직접 말하지 않는다.

**S-measure**는 object-aware와 region-aware similarity를 결합해 구조 보존을 평가한다. 객체 전체 형태가 맞는지 보는 데 유용하다. **E-measure**는 이미지 수준 통계와 픽셀 matching을 함께 고려해 예측과 정답의 정렬 정도를 본다. 논문마다 max·mean 표기가 다를 수 있으므로 열 이름을 확인해야 한다.

## 표를 비교할 때의 체크리스트

첫째, backbone과 pretraining을 맞춘다. ResNet-50과 대형 ViT, ImageNet과 SAM/CLIP은 같은 출발선이 아니다. 둘째, 입력 해상도와 multi-scale test, horizontal flip, CRF 같은 post-processing을 확인한다. 셋째, 외부 SOD·depth·video·synthetic data를 썼는지 본다.

넷째, metric 구현과 resize 방식이 같은지 확인한다. 예측을 원본 해상도로 되돌리는 방법, threshold sampling, 빈 mask 처리에 따라 작은 차이가 생긴다. 가능하면 공식 prediction map을 동일 evaluator로 다시 계산하는 것이 안전하다.

다섯째, 평균 숫자 밖의 subset을 본다. 작은 객체, 여러 객체, 인공 위장, 심한 가림, domain shift에서 결과가 어떤지 확인해야 모델의 실제 강점을 알 수 있다.

## 재현할 때 남길 기록

데이터 버전과 파일 목록, train/test split hash, 입력 resize와 crop, random seed, backbone checkpoint, optimizer와 schedule, best checkpoint 선택 기준을 기록한다. FPS는 GPU, batch size, warm-up, mixed precision 포함 여부를 함께 적는다. 파라미터 수만으로 메모리나 지연 시간을 대신하지 않는다.

내가 논문 표를 읽을 때는 ‘모든 지표에서 일관된가’, ‘주장한 실패 조건에서 실제로 좋아졌는가’, ‘추가 계산과 데이터에 비해 이득이 충분한가’를 먼저 본다. 0.001의 최고 기록보다 재현 가능한 설정과 실패 분석이 더 오래 남는다.
