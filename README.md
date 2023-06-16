# SustainChain BOS widget

![SustainChain](/assets/sustain-chain.png)

[Near BOS](https://docs.near.org/bos) widget for [SustainChain](https://devfolio.co/projects/sustainchain-supply-chain-management-system-418a) developed during ETHPrague 2023 hackathon

The app is consists of two parts: BOS widget (this repository) and self-hosted [react app](https://github.com/Umbrien/ETHPrague-react-app) inside of an iframe. To communicate between them, project is using [near-social-bridge](https://github.com/wpdas/near-social-bridge)

![Admin home screen](/assets/admin-home.png)
![Packages analytics](/assets/packages-analytics.png)
![Packages information](/assets/packages-information.png)

## Local development

0. run [react app](https://github.com/Umbrien/ETHPrague-react-app)
1. run [bos-loader](https://github.com/near/bos-loader): `bos-loader <account_id>`
2. go to `near.org/flags`, fill in localhost address
3. go to `near.org/<account_id>/widget/<component_name>`
