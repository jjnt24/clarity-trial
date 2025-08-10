;; Simple Token - SIP-010 Standard Implementation
;; Workshop Version: Minimal but compliant

;; (define-constant THIS_CONTRACT (as-contract tx-sender))


;; Implement SIP-010 fungible token trait
;; (impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)
;; (impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)
(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)
;; (use-trait sip-010-trait .sip-010-trait)

(define-trait sip-010-trait
  (
    ;; define the full SIP-010 trait interface here
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-name () (response (string-utf8 32) uint))
    (get-symbol () (response (string-utf8 32) uint))
    (get-decimals () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
    (get-owner () (response principal uint))
  )
)

;; Define the token
(define-fungible-token workshop-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Token metadata
(define-constant token-name "Timothy Token")
(define-constant token-symbol "TTK")
(define-constant token-decimals u6)
(define-constant token-uri u"https://workshop.blockdev.id/token.json")

;; SIP-010 required functions
(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-balance (user principal))
  (ok (ft-get-balance workshop-token user))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply workshop-token))
)

(define-read-only (get-token-uri)
  (ok (some token-uri))
)

;; SIP-010 transfer function
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq from tx-sender) err-not-token-owner)
    (ft-transfer? workshop-token amount from to)
  )
)

;; Mint function (owner only)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? workshop-token amount to)
  )
)

;; Burn function (for redeem)
(define-public (burn (amount uint))
  (ft-burn? workshop-token amount tx-sender)
)