---
theme: ../slidev-theme-swiss
addons:
  # addon の相対パスは deck ディレクトリの 1 つ上 (packages/) から解決される
  - ./slidev-addon-swiss
title: slidev-addon-swiss
---

# Components

<div class="swiss-grid mt-4">
  <SwissCard title="SwissCard" label="01" class="col-span-6 h-48">
    color で地の色を変えられる
  </SwissCard>
  <div class="col-span-6 flex items-center justify-around">
    <SwissShape shape="circle" :size="90" />
    <SwissShape shape="square" :size="90" color="ink" />
    <SwissShape shape="cross" :size="90" color="line" />
  </div>
</div>
