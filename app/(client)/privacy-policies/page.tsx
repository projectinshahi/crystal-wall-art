import React from 'react';

const page = () => {
  return (
    <main className="bg-white text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Privacy Policy</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Protecting Your Privacy Is Our Priority</h1>
          <p className="text-lg leading-8 text-slate-700">
            "A Brand of Crystal Glass Art"<br />
            References to "Crystal Wall Art", "we", "our", or "us" in this Privacy Policy refer to Crystal Glass Art, the legal entity operating the Crystal Wall Art brand.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What We Collect</h2>
              <p className="text-slate-600 leading-7">
                At Crystal Wall Art, protecting your privacy is one of our highest priorities. We collect customer information such as name, phone number, email address, shipping address, uploaded photographs, and order details solely for order processing, customer support, production, and delivery purposes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p className="text-slate-600 leading-7">
                We use the customer information we collect to process orders, communicate with you about your purchase, support production and customization, complete shipping and delivery, and provide timely customer service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Sharing</h2>
              <p className="text-slate-600 leading-7">
                We do not sell, rent, or share customer personal information with third parties except where required for payment processing, shipping, legal compliance, or service fulfillment.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Uploaded Photographs</h2>
              <p className="text-slate-600 leading-7">
                Uploaded photographs are stored securely and are accessible only to authorized team members involved in design, production, and customer support.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Security Measures</h2>
              <p className="text-slate-600 leading-7">
                We use industry-standard security measures to protect customer information from unauthorized access, misuse, or disclosure.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="text-slate-600 leading-7">
                Customers may contact us at any time regarding data access, correction, or deletion requests.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Consent</h2>
              <p className="text-slate-600 leading-7">
                By using our website, you consent to the collection and use of information as described in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
