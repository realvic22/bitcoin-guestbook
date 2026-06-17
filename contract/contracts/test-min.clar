(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_OWNER (err u102))
(define-data-var fees-collected uint u0)

(define-public (withdraw-fees)
  (let
    ((amount (var-get fees-collected))
     (caller tx-sender))
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_OWNER)
    (var-set fees-collected u0)
    (try! (as-contract (stx-transfer? amount tx-sender caller)))
  )
)
