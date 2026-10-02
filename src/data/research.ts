/** Source-checked additions. Bibliographic year is the publication year, not the arXiv year. */
export const RESEARCH_UPDATED = '2026-10-02';
export const groups = [
  { id: 'ovcos', label: 'Open-vocabulary camouflage', ko: 'OVCOS', color: '#367366', x: 440, y: 155 },
  { id: 'alignment', label: 'Dense vision–language alignment', ko: '의미 정렬', color: '#5276a2', x: 190, y: 165 },
  { id: 'structure', label: 'Structure & boundaries', ko: '구조·경계', color: '#a47935', x: 700, y: 170 },
  { id: 'foundation', label: 'Foundation model adaptation', ko: '기반 모델', color: '#8c6d95', x: 445, y: 385 },
  { id: 'learning', label: 'Learning with fewer labels', ko: '학습·감독', color: '#b16f5a', x: 700, y: 390 },
  { id: 'transfer', label: 'Domains, video & instances', ko: '도메인·인스턴스', color: '#667e8a', x: 175, y: 405 }
] as const;
export type GroupId = typeof groups[number]['id'];
export const features = ['open-vocabulary', 'camouflage', 'alignment', 'structure', 'foundation', 'label-efficient', 'multimodal', 'instance-video', 'domain-transfer', 'frequency'] as const;
export type Feature = typeof features[number];
export const featureLabels: Record<Feature, string> = {
  'open-vocabulary': 'Open vocabulary', camouflage: 'Camouflage', alignment: 'Language alignment',
  structure: 'Structure / boundary', foundation: 'Foundation models', 'label-efficient': 'Label efficiency',
  multimodal: 'Multimodal input', 'instance-video': 'Instance / video', 'domain-transfer': 'Domain transfer', frequency: 'Frequency'
};
export type ResearchPaper = {
  id: string; short: string; title: string; year: number; venue: string; group: GroupId;
  features: Feature[]; summary: string; question: string; source: string;
  code?: string; review?: string; preprint?: boolean; evidence?: string;
};

export const additions: ResearchPaper[] = [
  {
    id: 'baclip', short: 'BaCLIP', year: 2026, venue: 'CVPR 2026', group: 'ovcos',
    title: 'Seeing Both Sides: Towards Bidirectional Semantic Alignment for Open-Vocabulary Camouflaged Object Segmentation',
    features: ['open-vocabulary', 'camouflage', 'alignment', 'foundation', 'structure'],
    summary: '시각·텍스트 특징을 양방향으로 보정하고, 정렬된 텍스트를 SAM의 프롬프트로 전달한다.',
    question: '양방향 정렬의 효과와 SAM을 사용하는 효과를 분리할 수 있을까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2026/html/Zhang_Seeing_Both_Sides_Towards_Bidirectional_Semantic_Alignment_for_Open-Vocabulary_Camouflaged_CVPR_2026_paper.html',
    code: 'https://github.com/okmaybach/BaCLIP-CVPR2026', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'fgob', short: 'Fine-grained binding', year: 2026, venue: 'CVPR 2026', group: 'ovcos',
    title: 'Training-Free Open-Vocabulary Camouflaged Object Segmentation via Fine-Grained Object Binding and Adaptive Hybrid Prompt',
    features: ['open-vocabulary', 'camouflage', 'alignment', 'foundation', 'label-efficient'],
    summary: '세밀한 객체·배경 설명과 패치 간 관계를 활용하는 학습 없는 OVCOS 연구.',
    question: '추가 학습 없이 얻는 이득에 설명 생성 비용과 프롬프트 민감도는 얼마나 기여할까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2026/html/Ren_Training-Free_Open-Vocabulary_Camouflaged_Object_Segmentation_via_Fine-Grained_Object_Binding_and_CVPR_2026_paper.html', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'cascaded-vlm', short: 'Cascaded VLMs', year: 2026, venue: 'CVM 2026', group: 'ovcos',
    title: 'Open-Vocabulary Camouflaged Object Segmentation with Cascaded Vision Language Models',
    features: ['open-vocabulary', 'camouflage', 'alignment', 'structure', 'foundation'],
    summary: '크롭 영역과 전체 이미지 사이의 VLM 도메인 차이, 위장 객체의 약한 경계를 함께 다룬다.',
    question: '분류를 먼저 할 때와 마스크를 먼저 만들 때 오류가 어떻게 전파될까?',
    source: 'https://doi.org/10.26599/CVM.2025.9450512', code: 'https://github.com/intcomp/camouflaged-vlm',
    evidence: 'Author manuscript · Computational Visual Media 12, 473–492 (2026); arXiv:2506.19300'
  },
  {
    id: 'ovcis-diffusion', short: 'OVCIS · Diffusion', year: 2026, venue: 'IJCV 2026', group: 'ovcos',
    title: 'Catch Me If You Can Describe Me: Open-Vocabulary Camouflaged Instance Segmentation with Diffusion',
    features: ['open-vocabulary', 'camouflage', 'alignment', 'foundation', 'instance-video'],
    summary: '확산 모델의 다중 스케일 표현과 텍스트 특징으로 위장 객체를 인스턴스 단위에서 분리한다.',
    question: '의미 분할에서 인스턴스 분할로 옮기면 어떤 실패와 평가 지표가 새로 생길까?',
    source: 'https://link.springer.com/article/10.1007/s11263-026-02804-4', evidence: 'Publisher full text · IJCV 134, article 210 · 2026-04-07'
  },
  {
    id: 'cat-seg', short: 'CAT-Seg', year: 2024, venue: 'CVPR 2024', group: 'alignment',
    title: 'CAT-Seg: Cost Aggregation for Open-Vocabulary Semantic Segmentation',
    features: ['open-vocabulary', 'alignment', 'structure', 'foundation'],
    summary: '이미지·텍스트 유사도를 공간과 클래스 차원에서 집계한다.',
    question: '특징 자체의 결합과 유사도 집계는 위장 영역에서 어떻게 다르게 작동할까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2024/html/Cho_CAT-Seg_Cost_Aggregation_for_Open-Vocabulary_Semantic_Segmentation_CVPR_2024_paper.html', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'sed', short: 'SED', year: 2024, venue: 'CVPR 2024', group: 'alignment',
    title: 'SED: A Simple Encoder-Decoder for Open-Vocabulary Semantic Segmentation',
    features: ['open-vocabulary', 'alignment', 'structure', 'foundation'],
    summary: '계층적 인코더와 점진적 디코더로 이미지 수준 표현을 픽셀 예측에 맞춘다.',
    question: '초기 클래스 제거가 드물거나 잘 보이지 않는 객체를 먼저 지워버리지 않을까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2024/html/Xie_SED_A_Simple_Encoder-Decoder_for_Open-Vocabulary_Semantic_Segmentation_CVPR_2024_paper.html', code: 'https://github.com/xb534/SED', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'clipself', short: 'CLIPSelf', year: 2024, venue: 'ICLR 2024', group: 'alignment',
    title: 'CLIPSelf: Vision Transformer Distills Itself for Open-Vocabulary Dense Prediction',
    features: ['open-vocabulary', 'alignment', 'foundation', 'label-efficient'],
    summary: '영역·텍스트 쌍 없이 CLIP의 이미지 수준 인식을 지역 표현으로 증류한다.',
    question: '작은 영역과 주변 맥락을 분리하면 위장 객체 인식은 나아질까?',
    source: 'https://proceedings.iclr.cc/paper_files/paper/2024/hash/e7947b5e1d30864ebbe8714dbdd611d9-Abstract-Conference.html', evidence: 'ICLR proceedings · abstract'
  },
  {
    id: 'proxyclip', short: 'ProxyCLIP', year: 2024, venue: 'ECCV 2024', group: 'alignment',
    title: 'ProxyCLIP: Proxy Attention Improves CLIP for Open-Vocabulary Segmentation',
    features: ['open-vocabulary', 'alignment', 'foundation', 'label-efficient', 'structure'],
    summary: '시각 기반 모델의 공간 관계를 CLIP의 의미 표현에 연결한다.',
    question: '빌려온 공간 관계가 객체 경계와 배경 텍스처를 구분하는가?',
    source: 'https://github.com/mc-lan/ProxyCLIP', evidence: 'Official author repository · ECCV 2024'
  },
  {
    id: 'corrclip', short: 'CorrCLIP', year: 2025, venue: 'ICCV 2025', group: 'alignment',
    title: 'CorrCLIP: Reconstructing Patch Correlations in CLIP for Open-Vocabulary Semantic Segmentation',
    features: ['open-vocabulary', 'alignment', 'structure', 'foundation', 'label-efficient'],
    summary: 'CLIP의 패치 간 상관관계를 재구성해 조밀한 예측을 개선한다.',
    question: '같은 텍스처를 공유하는 객체와 배경이 잘못 연결되는 경우를 어떻게 확인할까?',
    source: 'https://openaccess.thecvf.com/content/ICCV2025/html/Zhang_CorrCLIP_Reconstructing_Patch_Correlations_in_CLIP_for_Open-Vocabulary_Semantic_Segmentation_ICCV_2025_paper.html', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'odise', short: 'ODISE', year: 2023, venue: 'CVPR 2023', group: 'foundation',
    title: 'Open-Vocabulary Panoptic Segmentation With Text-to-Image Diffusion Models',
    features: ['open-vocabulary', 'alignment', 'foundation', 'instance-video'],
    summary: '고정된 확산·판별 모델의 표현을 결합하는 개방 어휘 파놉틱 분할.',
    question: '확산 표현이 위장 객체에 주는 이득은 의미 정보일까, 공간 정보일까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2023/html/Xu_Open-Vocabulary_Panoptic_Segmentation_With_Text-to-Image_Diffusion_Models_CVPR_2023_paper.html', code: 'https://github.com/NVlabs/ODISE', evidence: 'CVF proceedings · abstract'
  },
  {
    id: 'run', short: 'RUN', year: 2025, venue: 'ICML 2025', group: 'structure',
    title: 'RUN: Reversible Unfolding Network for Concealed Object Segmentation',
    features: ['camouflage', 'structure'],
    summary: '전경·배경 분리 문제를 펼쳐 마스크와 RGB 영역에서 반복적으로 보정한다.',
    question: '재구성 잔차가 구조적 불확실성의 관측치로 쓰일 수 있을까?',
    source: 'https://proceedings.mlr.press/v267/he25w.html', code: 'https://github.com/ChunmingHe/RUN', evidence: 'PMLR proceedings · abstract'
  },
  {
    id: 'vscode-v2', short: 'VSCode-v2', year: 2026, venue: 'TPAMI 2026', group: 'foundation',
    title: 'VSCode-v2: Dynamic Prompt Learning for General Visual Salient and Camouflaged Object Detection With Two-Stage Optimization',
    features: ['camouflage', 'foundation', 'multimodal', 'domain-transfer'],
    summary: '프롬프트 전문가와 두 단계 학습으로 여러 SOD·COD 작업의 공통성과 차이를 다룬다.',
    question: '작업 간 일반화와 학습에 없던 클래스에 대한 일반화를 어떻게 구분할까?',
    source: 'https://doi.org/10.1109/TPAMI.2025.3635136', evidence: 'Author abstract · TPAMI 48(3), 3137–3153; online 2025, issue 2026'
  },
  {
    id: 'reattnclip', short: 'ReAttnCLIP', year: 2026, venue: 'CVPR 2026', group: 'transfer',
    title: 'ReAttnCLIP: Training-Free Open-Vocabulary Remote Sensing Image Segmentation via Re-defined Attention in CLIP',
    features: ['open-vocabulary', 'alignment', 'foundation', 'label-efficient', 'domain-transfer'],
    summary: 'CLIP 어텐션을 재정의하는 원격탐사 영상의 학습 없는 개방 어휘 분할.',
    question: '위장 장면과 원격탐사의 작은 객체가 공유하는 표현 병목은 무엇일까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2026/html/Niu_ReAttnCLIP_Training-Free_Open-Vocabulary_Remote_Sensing_Image_Segmentation_via_Re-defined_Attention_CVPR_2026_paper.html', evidence: 'CVF proceedings · title / bibliographic record; detailed review pending'
  },
  {
    id: 'llava-prior', short: 'The Power of Prior', year: 2026, venue: 'CVPR 2026', group: 'alignment',
    title: 'The Power of Prior: Training-Free Open-Vocabulary Semantic Segmentation with LLaVA',
    features: ['open-vocabulary', 'alignment', 'foundation', 'label-efficient'],
    summary: 'LLaVA를 사용하는 학습 없는 개방 어휘 의미 분할 연구.',
    question: '언어 모델의 사전 지식과 이미지에 실제 존재하는 증거를 분리할 수 있을까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2026/html/Zhang_The_Power_of_Prior_Training-Free_Open-Vocabulary_Semantic_Segmentation_with_LLaVA_CVPR_2026_paper.html', evidence: 'CVF proceedings · title / bibliographic record; detailed review pending'
  },
  {
    id: 'direct-seg', short: 'Direct Segmentation', year: 2026, venue: 'CVPR 2026', group: 'alignment',
    title: 'Direct Segmentation without Logits Optimization for Training-Free Open-Vocabulary Semantic Segmentation',
    features: ['open-vocabulary', 'alignment', 'foundation', 'label-efficient'],
    summary: '로짓 최적화 없이 직접 분할하는 학습 없는 개방 어휘 접근.',
    question: '추론 단계 최적화의 제거가 비용과 작은 객체 인식에 어떤 차이를 만들까?',
    source: 'https://openaccess.thecvf.com/content/CVPR2026/html/Li_Direct_Segmentation_without_Logits_Optimization_for_Training-Free_Open-Vocabulary_Semantic_Segmentation_CVPR_2026_paper.html', evidence: 'CVF proceedings · title / bibliographic record; detailed review pending'
  },
  {
    id: 'vico-sam3', short: 'ViCo-SAM3', year: 2026, venue: 'arXiv · Sep 2026', group: 'ovcos', preprint: true,
    title: 'ViCo-SAM3: Vision-Conditioned Alignment for Open-Vocabulary Camouflaged Object Segmentation',
    features: ['open-vocabulary', 'camouflage', 'alignment', 'foundation'],
    summary: '현재 이미지의 시각 맥락으로 텍스트 표현과 교차 모달 정렬을 조절한다.',
    question: '텍스트 인코더 전체 미세조정 없이 새로운 클래스에 대한 유연성을 유지할까?',
    source: 'https://arxiv.org/abs/2609.15418', evidence: 'arXiv abstract · 2026-09-14 · peer-reviewed venue not verified'
  }
];

// Editorial topic annotations of the existing archive. These are research
// descriptors, not measurements of method quality or pretrained embeddings.
export const reviewAnnotations: Record<string, { short: string; group: GroupId; features: Feature[] }> = {
  'ovcos-ovcoser-eccv2024': { short: 'OVCoser', group: 'ovcos', features: ['open-vocabulary', 'camouflage', 'alignment', 'structure', 'foundation'] },
  'seeing-the-unseen-suclip': { short: 'SuCLIP', group: 'ovcos', features: ['open-vocabulary', 'camouflage', 'alignment', 'foundation'] },
  'tistory-40': { short: 'OVSeg', group: 'alignment', features: ['open-vocabulary', 'alignment', 'foundation'] },
  'adaptive-refinement-arm-cod': { short: 'ARM', group: 'foundation', features: ['camouflage', 'foundation', 'multimodal', 'structure'] },
  'mm-sam-camouflaged-scene-segmentation': { short: 'MM-SAM', group: 'foundation', features: ['camouflage', 'foundation', 'alignment', 'multimodal'] },
  'sam-dsa-rgbd-cod': { short: 'SAM-DSA', group: 'foundation', features: ['camouflage', 'foundation', 'multimodal', 'structure'] },
  'vscode-generalist-cod-cvpr2024': { short: 'VSCode', group: 'foundation', features: ['camouflage', 'foundation', 'multimodal', 'domain-transfer'] },
  'source-free-depth-pop-out-iccv2023': { short: 'Depth Pop-out', group: 'foundation', features: ['camouflage', 'foundation', 'structure', 'multimodal'] },
  'escnet-edge-semantic-cod': { short: 'ESCNet', group: 'structure', features: ['camouflage', 'structure'] },
  'fdcod-cvpr2022': { short: 'FDCOD', group: 'structure', features: ['camouflage', 'structure', 'frequency'] },
  'feder-cod-cvpr2023': { short: 'FEDER', group: 'structure', features: ['camouflage', 'structure', 'frequency'] },
  'fsel-cod-eccv2024': { short: 'FSEL', group: 'structure', features: ['camouflage', 'structure', 'frequency'] },
  'fspnet-transformer-cod-cvpr2023': { short: 'FSPNet', group: 'structure', features: ['camouflage', 'structure'] },
  'zoomnet-cvpr2022': { short: 'ZoomNet', group: 'structure', features: ['camouflage', 'structure'] },
  'segmar-cvpr2022': { short: 'SegMaR', group: 'structure', features: ['camouflage', 'structure'] },
  'pfnet-distraction-mining-cvpr2021': { short: 'PFNet', group: 'structure', features: ['camouflage', 'structure'] },
  'mutual-graph-learning-cod-cvpr2021': { short: 'MGL', group: 'structure', features: ['camouflage', 'structure'] },
  'rank-camouflaged-objects-cvpr2021': { short: 'Rank COD', group: 'structure', features: ['camouflage', 'structure', 'instance-video'] },
  'ugtr-cod-iccv2021': { short: 'UGTR', group: 'structure', features: ['camouflage', 'structure'] },
  'joint-sod-cod-cvpr2021': { short: 'Joint SOD / COD', group: 'structure', features: ['camouflage', 'structure', 'domain-transfer'] },
  'cod-benchmarks-guide': { short: 'COD benchmarks', group: 'structure', features: ['camouflage'] },
  'uscnet-unconstrained-scenes': { short: 'USCNet', group: 'learning', features: ['camouflage', 'domain-transfer'] },
  'rise-unsupervised-cod': { short: 'RISE', group: 'learning', features: ['camouflage', 'label-efficient', 'foundation'] },
  'ease-environment-aware-unsupervised-cod': { short: 'EASE', group: 'learning', features: ['camouflage', 'label-efficient'] },
  'ucod-dpl-dynamic-pseudo-label-learning': { short: 'UCOD-DPL', group: 'learning', features: ['camouflage', 'label-efficient'] },
  'noisy-pseudo-label-cod-eccv2024': { short: 'Noisy pseudo labels', group: 'learning', features: ['camouflage', 'label-efficient'] },
  'just-a-hint-point-supervised-cod-eccv2024': { short: 'Just a Hint', group: 'learning', features: ['camouflage', 'label-efficient'] },
  'making-and-breaking-of-camouflage-iccv2023': { short: 'Make & Break', group: 'learning', features: ['camouflage', 'label-efficient'] },
  'dcnet-cis-cvpr2023': { short: 'DCNet', group: 'transfer', features: ['camouflage', 'structure', 'instance-video'] },
  'implicit-motion-vcod-cvpr2022': { short: 'Implicit Motion', group: 'transfer', features: ['camouflage', 'instance-video'] },
  'srrnet-video-camouflaged-objects': { short: 'SRRNet', group: 'transfer', features: ['camouflage', 'instance-video'] },
  'tsp-sam-vcod-cvpr2024': { short: 'TSP-SAM', group: 'transfer', features: ['camouflage', 'foundation', 'instance-video'] },
  'tistory-37': { short: 'SR survey', group: 'transfer', features: ['structure', 'domain-transfer'] },
  'tistory-38': { short: 'FeNet', group: 'transfer', features: ['structure', 'domain-transfer'] },
  'tistory-39': { short: 'HAT', group: 'transfer', features: ['structure'] },
  'tistory-42': { short: 'SAR · interaction', group: 'transfer', features: ['domain-transfer', 'label-efficient'] },
  'tistory-43': { short: 'SAR · transfer', group: 'transfer', features: ['domain-transfer', 'label-efficient'] },
  'tistory-44': { short: 'SAR · alignment', group: 'transfer', features: ['domain-transfer', 'label-efficient'] }
};

export const readingPlans = [
  { id: 'alignment-evolution', title: 'OVCoser에서 BaCLIP까지, 의미 정렬은 어디서 달라졌나', group: 'ovcos', priority: '먼저 읽기', papers: ['ovcos-ovcoser-eccv2024', 'seeing-the-unseen-suclip', 'baclip'], question: '텍스트가 마스크로 전달되는 경로를 같은 도식에 놓고 비교한다.', outline: ['반복 의미 주입 → 맥락 프롬프트 → 양방향 보정', '고정·학습되는 모듈과 감독 신호 표', '백본·해상도·추가 모델을 맞춘 비교 조건'] },
  { id: 'training-free-ovcos', title: '학습 없는 OVCOS의 비용은 어디로 이동하는가', group: 'ovcos', priority: '먼저 읽기', papers: ['fgob', 'llava-prior', 'direct-seg'], question: '학습 비용, 설명 생성, 추론 보정을 따로 계산한다.', outline: ['학습 없음과 사전학습 없음의 구분', '객체·배경 설명 및 하이브리드 프롬프트의 역할', '설명 교란·프롬프트 수·추론 시간 실험 설계'] },
  { id: 'cascade-order', title: '먼저 찾을까, 먼저 이름 붙일까', group: 'ovcos', priority: '먼저 읽기', papers: ['cascaded-vlm', 'tistory-40', 'ovcos-ovcoser-eccv2024'], question: '분류와 분할의 순서를 바꿨을 때 오류의 출발점을 추적한다.', outline: ['전체 이미지와 마스크 크롭의 표현 차이', '정답 마스크·정답 클래스 oracle 비교', '작은 객체에서 누적되는 오류'] },
  { id: 'camouflaged-instances', title: '하나의 마스크에서 여러 개체로: OVCIS', group: 'ovcos', priority: '먼저 읽기', papers: ['ovcis-diffusion', 'odise', 'dcnet-cis-cvpr2023'], question: '의미 분할과 인스턴스 분할의 가정과 지표를 분리한다.', outline: ['겹침·다중 개체에서의 매칭 문제', '확산 특징과 CLIP 표현의 역할', '동일 split에서만 비교할 지표와 실패 유형'] },
  { id: 'cost-space', title: 'CLIP 특징을 바꿀까, 유사도를 모을까', group: 'alignment', priority: '이어 읽기', papers: ['cat-seg', 'sed', 'clipself'], question: '지역 표현과 cost aggregation의 차이를 OVCOS 관점에서 읽는다.', outline: ['픽셀·영역·이미지 수준 정렬', '학습 데이터와 클래스 제거 전략', '위장 객체에 옮겨볼 실험 가설'] },
  { id: 'patch-relations', title: '어텐션의 이웃이 정말 같은 객체인가', group: 'alignment', priority: '이어 읽기', papers: ['proxyclip', 'corrclip', 'reattnclip'], question: '패치 관계를 바꾸는 방법과 객체·배경 혼동의 관계를 살핀다.', outline: ['공간 관계를 어디서 얻는가', '경계 양쪽의 affinity 진단', '반복 텍스처·작은 객체·도메인 변화 비교'] },
  { id: 'structure-routing', title: '구조적 불확실성은 어떤 신호로 볼 수 있나', group: 'structure', priority: '이어 읽기', papers: ['run', 'ugtr-cod-iccv2021', 'feder-cod-cvpr2023'], question: '잔차·경계·불확실성이 서로 같은 실패를 가리키는지 확인한다.', outline: ['RGB 재구성과 마스크 보정의 차이', '경계 오차와 클래스 오차의 분리', '불확실성의 위치별 진단 방법'] },
  { id: 'prompt-generalization', title: '프롬프트의 일반화: 새 작업과 새 클래스', group: 'foundation', priority: '이어 읽기', papers: ['vscode-generalist-cod-cvpr2024', 'vscode-v2', 'sam-dsa-rgbd-cod'], question: '작업 일반화와 개방 어휘 일반화를 같은 주장으로 읽지 않는다.', outline: ['domain prompt와 language prompt의 구분', '멀티모달 입력·감독 조건 정리', '공통 표현과 작업별 표현의 분리'] },
  { id: 'labels-and-retrieval', title: '정답이 부족할 때, 다른 이미지가 주는 단서', group: 'learning', priority: '이어 읽기', papers: ['rise-unsupervised-cod', 'ease-environment-aware-unsupervised-cod', 'ucod-dpl-dynamic-pseudo-label-learning'], question: '검색과 의사 라벨이 배경 편향을 줄이는 조건을 찾는다.', outline: ['데이터셋 수준 검색과 단일 이미지 학습', '라벨 갱신 과정의 오류 누적', '클래스·배경이 바뀐 경우의 분리 평가'] },
  { id: 'frequency-boundary', title: '경계와 주파수 단서가 만나는 지점', group: 'structure', priority: '이어 읽기', papers: ['fdcod-cvpr2022', 'feder-cod-cvpr2023', 'fsel-cod-eccv2024'], question: '고주파 강화가 경계 복원과 배경 노이즈에 주는 영향을 나눈다.', outline: ['주파수 분해가 적용되는 위치', '텍스처가 강한 배경에서의 실패', '경계·영역·연산량 비교표'] },
  { id: 'video-evidence', title: '한 장에서 보이지 않는 객체, 시간에서는 보일까', group: 'transfer', priority: '확장 읽기', papers: ['implicit-motion-vcod-cvpr2022', 'tsp-sam-vcod-cvpr2024', 'srrnet-video-camouflaged-objects'], question: '움직임과 메모리가 주는 추가 정보를 단일 이미지 OVCOS와 구분한다.', outline: ['시간 정보의 사용 위치', '카메라 움직임과 객체 움직임', '언어 조건을 붙일 때 새로 필요한 평가'] },
  { id: 'sam3-watch', title: 'ViCo-SAM3: 시각 맥락으로 텍스트를 조절하기', group: 'ovcos', priority: '동향 확인', papers: ['vico-sam3', 'baclip', 'seeing-the-unseen-suclip'], question: '프리프린트의 주장과 검증된 비교 조건을 따로 기록한다.', outline: ['시각 조건부 텍스트 조절', '텍스트 인코더의 학습 범위', '코드·최종 게재처·동일 조건 결과 확인'] }
] as const;
