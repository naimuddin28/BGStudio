import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "Does this use an API?",
      a: "No. Background removal runs locally in your browser using an open-source AI model."
    },
    {
      q: "Is my image uploaded?",
      a: "No. The background-removal processing is designed to run completely locally in your browser. Your images never go to any server."
    },
    {
      q: "Can I download a transparent PNG?",
      a: "Yes, you can easily download your edited image with a transparent background in PNG format."
    },
    {
      q: "Can I add a custom background?",
      a: "Yes, you can upload any image to serve as the new background for your subject."
    },
    {
      q: "Can I change the background color?",
      a: "Yes, you can use our color picker or select from predefined solid colors."
    },
    {
      q: "Is it free?",
      a: "Yes. Since there are no API costs involved, the tool is completely free. Processing speed depends on your device's performance."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
