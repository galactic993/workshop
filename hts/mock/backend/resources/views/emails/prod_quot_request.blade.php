制作見積依頼が行われました

【見積書No】 {{ $quot->quot_number }}
【担当部署】 {{ $quot->sectionCd->section_cd ?? '' }} {{ $quot->sectionCd->section_name ?? '' }}
【得意先】 {{ $quot->customer->customer_cd ?? '' }} {{ $quot->customer_id ? ($quot->customer->customer_cd === '33900' ? $quot->customer_name : $quot->customer->customer_name) : '' }}
【見積件名】 {{ $quot->quot_subject ?? '' }}
【品名】 {{ $quot->prod_name ?? '' }}
【見積概要】
{{ $quot->quot_summary ?? '' }}
【参考資料】 {{ $quot->reference_doc_path ?? '参考資料は未登録です' }}
【伝達事項】
{{ $quot->message ?? '伝達事項はありません' }}
