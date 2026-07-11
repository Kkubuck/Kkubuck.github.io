---
title: 'Scoring, Remember, and Reference: Catching Camouflaged Objects in Videos'
description: SRR은 dual-purpose decoder로 mask와 reference score를 생성하고, reference-guided multilevel asymmetric attention으로
  memory와 motion을 통합한다.
summary: SRR은 dual-purpose decoder로 mask와 reference score를 생성하고, reference-guided multilevel asymmetric attention으로
  memory와 motion을 통합한다.
subtitle: 모든 과거 프레임을 동일하게 기억하지 않고 mask와 quality score를 함께 예측해 좋은 reference를 선별하고, 장기 기억과 단기 motion을 비대칭 attention으로
  결합한 SRR.
pubDate: 2026-03-28 09:00:00 +0900
slug: srrnet-video-camouflaged-objects
kind: paper
lang: ko
tags:
- paper
- video-cod
- memory
- reference-frame
- iccv-2025
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2025/html/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.html
venue: ICCV 2025
paperYear: 2025
authors: Yu'ang Feng, Shuyong Gao, Fuzhen Yan, Yicheng Song, Lingyi Hong, Junjie Hu, Wenqiang Zhang
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2025/papers/Feng_Scoring_Remember_and_Reference_Catching_Camouflaged_Objects_in_Videos_ICCV_2025_paper.pdf
takeaways:
- mask와 함께 frame score를 예측해 기억할 가치가 높은 reference를 자동 선택한다.
- 장기 reference 정보와 인접 프레임 motion cue는 역할이 다르므로 multilevel asymmetric attention으로 결합한다.
- score가 초기 오검출을 높게 평가하면 잘못된 reference가 이후 전체 시퀀스를 오염시킬 수 있다.
---

## 비디오는 모든 프레임이 같은 가치가 없다

VCOD에서 한 프레임은 객체가 잘 드러나지만 다른 프레임은 가림이나 motion blur로 거의 보이지 않을 수 있다. 모든 과거 특징을 평균하면 좋은 단서가 나쁜 프레임에 희석되고, 직전 프레임만 보면 긴 정지·가림 구간을 견디기 어렵다. SRR은 **어떤 프레임을 기억할지 점수로 선택**한다.

사람이 한 번 명확히 본 물체를 기억해 이후 흐릿한 장면에서 알아보는 과정에서 영감을 얻었다. 흐름은 Scoring, Remember, Reference 세 단계로 요약된다.

## mask와 score를 함께 만드는 decoder

**dual-purpose decoder**는 현재 frame의 segmentation mask와 그 예측이 reference로 쓰일 만한지를 나타내는 score를 동시에 생성한다. score supervision은 단순 frame ranking을 넘어 feature extractor가 객체가 명확한 장면과 불확실한 장면을 구분하게 한다.

좋은 reference는 객체 형태와 위치가 안정적으로 보이고 background confusion이 적어야 한다. 선택된 frame은 memory에 저장되어 이후 프레임의 추가 단서가 된다. 모든 프레임을 보관하지 않으므로 메모리와 noise를 함께 줄일 수 있다.

## Remember와 Reference

과거 reference는 장기 appearance와 object identity를 제공하고, 인접 frame의 motion은 현재 위치 변화를 빠르게 알려 준다. 두 정보는 시간 범위와 신뢰도가 다르다. SRR의 **reference-guided multilevel asymmetric attention**은 이 둘을 대칭적으로 섞지 않고, 여러 feature level에서 서로 다른 방향과 비중으로 통합한다.

현재 특징은 reference에서 안정적인 객체 표현을 조회하고, short-term motion은 reference가 오래되어 생긴 위치 차이를 보정한다. 긴 기억과 가까운 움직임이 각각 무엇을 담당하는지 분명한 설계다.

## single-pass 효율성

논문은 비디오를 여러 번 왕복하거나 반복 refinement하지 않고 한 번의 순방향 처리로 reference를 갱신한다고 강조한다. 약 54M parameter로 구성해 대형 foundation-model 기반 VCOD와 다른 효율 지점을 노린다.

속도 주장은 실제 sequence length, memory slot 수, 입력 해상도에 따라 달라진다. single pass라도 attention이 저장된 reference 수에 비례하면 긴 영상에서 비용이 늘 수 있으므로, latency와 peak memory를 함께 봐야 한다.

## 결과에서 볼 항목

benchmark 평균 성능 외에 temporal stability와 reference selection visualization이 중요하다. 어떤 frame이 높은 score를 받았는지, 그 선택이 사람이 보기에도 객체가 명확한 시점인지, 잘못된 reference 이후 회복할 수 있는지를 확인해야 한다.

절제는 score 없는 일정 간격 sampling, 최근 frame만 저장, symmetric attention과 비교해야 한다. 그래야 개선이 memory 양 때문이 아니라 selection과 asymmetric fusion에서 왔다는 주장을 검증할 수 있다.

## 한계

score와 mask가 같은 decoder를 공유하면 둘이 같은 오류를 낼 가능성이 크다. 모델이 틀린 mask에 과도한 confidence를 주면 잘못된 reference가 장기 기억으로 남는다. 객체가 크게 변형되거나 여러 비슷한 개체가 교차할 때 identity switching도 생길 수 있다. reference diversity, uncertainty-aware eviction, 오류 후 memory reset이 실전 확장에 필요한 요소다.
