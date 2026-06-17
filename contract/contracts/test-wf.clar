(define-data-var fees-collected uint u0)

(define-public (withdraw-fees)
  (begin
    (try! (as-contract (stx-transfer? u100 tx-sender tx-sender)))
    (ok true)
  )
)
