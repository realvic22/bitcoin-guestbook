;; Bitcoin Guestbook - leave a permanent message on Stacks, anchored to Bitcoin

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ENTRY_FEE u10000) ;; 0.01 STX per message
(define-constant ERR_TOO_LONG (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-constant ERR_NOT_OWNER (err u102))

(define-map entries
  { entry-id: uint }
  { author: principal, message: (string-ascii 200), block: uint }
)

(define-data-var entry-count uint u0)
(define-data-var fees-collected uint u0)

(define-read-only (get-entry-count)
  (ok (var-get entry-count))
)

(define-read-only (get-entry (entry-id uint))
  (match (map-get? entries { entry-id: entry-id })
    entry (ok entry)
    ERR_NOT_FOUND
  )
)

(define-public (write (message (string-ascii 200)))
  (let
    (
      (id (+ (var-get entry-count) u1))
    )
    (asserts! (<= (len message) u200) ERR_TOO_LONG)
    (try! (stx-transfer? ENTRY_FEE tx-sender (as-contract tx-sender)))
    (var-set entry-count id)
    (map-set entries
      { entry-id: id }
      { author: tx-sender, message: message, block: block-height }
    )
    (var-set fees-collected (+ (var-get fees-collected) ENTRY_FEE))
    (print { notification: "new-entry", entry-id: id, author: tx-sender })
    (ok id)
  )
)

(define-read-only (get-fees-collected)
  (ok (var-get fees-collected))
)

(define-public (withdraw-fees)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_OWNER)
    (let
      ((amount (var-get fees-collected)))
      (var-set fees-collected u0)
      (as-contract (stx-transfer? amount tx-sender CONTRACT_OWNER))
    )
  )
)
