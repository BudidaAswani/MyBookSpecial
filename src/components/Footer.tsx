import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className=" mt-16">
        <div className=" mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <button
              onClick={() => setShowTerms(true)}
              className="text-primary  font-medium"
            >
              Terms & Conditions
            </button>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MyBookSpecial. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Terms & Conditions</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Rental Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Rental period is based on book length: 4-10 days depending on page count</li>
                <li>Full payment required upfront at time of order</li>
                <li>Return books within the specified time limit to receive 50% refund</li>
                <li>Late returns forfeit refund eligibility and book ownership transfers to customer</li>
                <li>Books must be returned in good condition (no damage, markings, or missing pages)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Refund Policy</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>50% refund processed within 3-5 business days of book return</li>
                <li>Refunds only applicable for rentals returned within deadline</li>
                <li>No refunds for purchased books</li>
                <li>Damaged books will not be eligible for refunds</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Delivery & Payment</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Standard delivery: 3-7 business days depending on location</li>
                <li>Payment methods: UPI, Net Banking, Cash on Delivery</li>
                <li>COD may have additional charges in select areas</li>
                <li>All prices are in Indian Rupees (₹)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Book Condition</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All books are quality checked before dispatch</li>
                <li>Minor wear on used books is acceptable</li>
                <li>Report any damage within 24 hours of receipt</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-foreground mb-2">Customer Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate contact and delivery information</li>
                <li>Track rental deadlines and return books on time</li>
                <li>Handle books with care during rental period</li>
                <li>Contact support for any issues or clarifications</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
