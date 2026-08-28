import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | GUKGIC Social App',
  description: 'Terms of service and user agreement for GUKGIC social application.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-dark-card text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-dark-text flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" />
            <span>ຂໍ້ກຳນົດ ແລະ ເງື່ອນໄຂການໃຊ້ງານ (Terms of Service)</span>
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 2026 • GUKGIC Platform</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-dark-card border border-slate-200/70 dark:border-slate-800/80 p-6 sm:p-8 space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">1. ຍິນດີຕ້ອນຮັບສູ່ GUKGIC (Acceptance of Terms)</h2>
          <p>
            GUKGIC ເປັນແພລດຟອມ Social ສຳລັບການຊອກຫາເພື່ອນໃໝ່ ແລະ ສ້າງຊຸມຊົນໃນປະເທດລາວ. ເມື່ອທ່ານເຂົ້າໃຊ້ງານແອັບພລິເຄຊັ່ນ ຖືວ່າທ່ານໄດ້ຍອມຮັບຂໍ້ກຳນົດເຫຼົ່ານີ້ທັງໝົດ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">2. ຄວາມປອດໄພ ແລະ ພຶດຕິກຳຂອງຜູ້ໃຊ້ (Community Conduct)</h2>
          <p>
            ຜູ້ໃຊ້ທຸກຄົນຕ້ອງປະຕິບັດຕາມກົດລະບຽບຊຸມຊົນ ຫ້າມໂພສ ຫຼື ສົ່ງຂໍ້ຄວາມທີ່ເປັນ:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>ການຄຸກຄາມ, ບູລີ່, ຫຼື ໃຊ້ຖ້ອຍຄຳຫຍາບຄາຍທີ່ບໍ່ເໝາະສົມ</li>
            <li>ສະແປມ, ໂຄສະນາຫຼອກລວງ ຫຼື ການສໍ້ໂກງ (Fraud / Scam)</li>
            <li>ເນື້ອຫາລາມົກອານາຈານ ຫຼື ລະເມີດກົດໝາຍຂອງ ສປປ ລາວ</li>
            <li>ການປອມແປງຕົວຕົນເປັນບຸກຄົນອື່ນ (Impersonation)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">3. ການລະງັບ ແລະ ຍົກເລີກບັນຊີ (Account Suspension & Termination)</h2>
          <p>
            ທີມງານຄວບຄຸມເນື້ອຫາ (Moderation Team) ຂອງ GUKGIC ມີສິດໃນການເຕືອນ, ຊ່ອນເນື້ອຫາ, ລະງັບຊົ່ວຄາວ, ຫຼື ແບນບັນຊີຜູ້ໃຊ້ທີ່ລະເມີດກົດລະບຽບໂດຍບໍ່ຈຳເປັນຕ້ອງແຈ້ງລ່ວງໜ້າ.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-dark-text">4. ຕິດຕໍ່ພວກເຮົາ (Contact)</h2>
          <p>
            ຫາກມີຄຳຖາມກ່ຽວກັບຂໍ້ກຳນົດການໃຊ້ງານ ສາມາດຕິດຕໍ່ທີມງານໄດ້ທີ່ support@gukgic.la
          </p>
        </section>
      </div>
    </div>
  );
}
