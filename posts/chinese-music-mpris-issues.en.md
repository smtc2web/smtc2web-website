---
date: 2026-11-01T17:45:02+08:00
title: "I am disappointed with Chinese music software's support for the Linux MPRIS protocol"
author: "AkarinLiu"
category: "Articles"
tags:
  - "Chinese music software"
  - "MPRIS"
  - "Linux"
description: "Nowadays, Chinese music software is not very active in supporting the MPRIS protocol, and I find that disappointing."
---

Recently, I installed CachyOS on my computer's 512GB Samsung drive. While using Chinese music software, I noticed that support for the MPRIS protocol is not a priority for them, which disappointed me. The software I develop for Linux feels increasingly useless.

## How did I find out?

Actually, I noticed it in the media controls of KDE Plasma. QQ Music, for example, only supports displaying track information. I also tried other software and found that niche third-party QQ Music clients are actually more proactive.

## Why write this post?

Because I am the developer of smtc2web, which targets both Windows and Linux. I entered the Linux world originally wanting to try out the software I developed, but reality poured cold water on me. In the Linux world of the Chinese music streaming market, only two official clients have Linux versions — QQ Music and NetEase Cloud Music — and they take different attitudes toward MPRIS support.

## Why do I push Chinese music software to support MPRIS?

Because the software I develop needs to use an MPRIS library on the Linux platform. If music software does not support MPRIS on Linux, then this software will appear to have no practical value in a Linux environment.
