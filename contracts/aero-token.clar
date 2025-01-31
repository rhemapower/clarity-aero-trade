;; Aviation Token NFT Contract
(define-non-fungible-token aviation-token uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-token-exists (err u101))
(define-constant err-not-token-owner (err u102))

;; Data Maps
(define-map token-data uint 
  {
    aircraft-type: (string-ascii 64),
    registration: (string-ascii 10),
    manufacturer: (string-ascii 64),
    owner: principal
  }
)

;; Create new aviation token
(define-public (create-token (token-id uint) 
                           (aircraft-type (string-ascii 64))
                           (registration (string-ascii 10))
                           (manufacturer (string-ascii 64)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-none (nft-get-owner? aviation-token token-id)) err-token-exists)
    (try! (nft-mint? aviation-token token-id tx-sender))
    (ok (map-set token-data token-id {
      aircraft-type: aircraft-type,
      registration: registration,
      manufacturer: manufacturer,
      owner: tx-sender
    }))
  )
)

;; Transfer token ownership
(define-public (transfer (token-id uint) (recipient principal))
  (begin
    (asserts! (is-eq (some tx-sender) (nft-get-owner? aviation-token token-id)) err-not-token-owner)
    (try! (nft-transfer? aviation-token token-id tx-sender recipient))
    (ok (map-set token-data token-id 
      (merge (unwrap-panic (map-get? token-data token-id))
            { owner: recipient })))
  )
)

;; Get token info
(define-read-only (get-token-info (token-id uint))
  (ok (map-get? token-data token-id))
)
