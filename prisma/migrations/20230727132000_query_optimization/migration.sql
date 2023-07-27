-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "optimized" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TableAccessFreq" (
    "tid" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TableAccessFreq_pkey" PRIMARY KEY ("tid")
);

-- CreateTable
CREATE TABLE "ColumnAccessFreq" (
    "cid" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ColumnAccessFreq_pkey" PRIMARY KEY ("cid")
);

-- CreateIndex
CREATE INDEX "TableAccessFreq_frequency_idx" ON "TableAccessFreq"("frequency" DESC);

-- CreateIndex
CREATE INDEX "ColumnAccessFreq_frequency_idx" ON "ColumnAccessFreq"("frequency" DESC);

-- AddForeignKey
ALTER TABLE "TableAccessFreq" ADD CONSTRAINT "TableAccessFreq_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Table"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColumnAccessFreq" ADD CONSTRAINT "ColumnAccessFreq_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Column"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;
