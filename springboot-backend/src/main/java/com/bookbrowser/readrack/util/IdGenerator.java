package com.bookbrowser.readrack.util;

import java.util.concurrent.ThreadLocalRandom;

public class IdGenerator {
    private static final long MIN_ID = 1_000_000_000L; // Smallest 10-digit number
    private static final long MAX_ID = 10_000_000_000L; // Smallest 11-digit number

    public static long generateRandom10DigitId() {
        // Generates a random long between MIN_ID (inclusive) and MAX_ID (exclusive)
        return ThreadLocalRandom.current().nextLong(MIN_ID, MAX_ID);
    }
}
