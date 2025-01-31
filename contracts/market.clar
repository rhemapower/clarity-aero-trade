;; AeroTrade Marketplace Contract
(use-trait aviation-token-trait .aero-token.aviation-token)

;; Constants
(define-constant err-invalid-price (err u200))
(define-constant err-not-listed (err u201))
(define-constant err-already-listed (err u202))

;; Data Maps
(define-map listings uint 
  {
    seller: principal,
    price: uint,
    listed: bool
  }
)

;; List token for sale
(define-public (list-for-sale (token-id uint) (price uint))
  (begin
    (asserts! (> price u0) err-invalid-price)
    (asserts! (is-none (map-get? listings token-id)) err-already-listed)
    (ok (map-set listings token-id {
      seller: tx-sender,
      price: price,
      listed: true
    }))
  )
)

;; Purchase listed token
(define-public (purchase (token-id uint))
  (let ((listing (unwrap! (map-get? listings token-id) err-not-listed)))
    (begin
      (asserts! (is-eq (get listed listing) true) err-not-listed)
      (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
      (try! (contract-call? .aero-token transfer token-id tx-sender))
      (ok (map-delete listings token-id))
    )
  )
)

;; Get listing info
(define-read-only (get-listing (token-id uint))
  (ok (map-get? listings token-id))
)
