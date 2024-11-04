#cite.js
a node.js API to describe the formatting of your referencing style and produce references from it


## Introduction
cite.js was created to address the issue of inputting academic referencing guides into a digital format.
While there are other notable solutions in the arena, they are often out of date and complicated to understand.
With this in mind, cite.js allows you to input referencing guides in a format familiar to most programmers,
while being simple enough for novices to utilise.

## How to use
Examples coming soon

## Terminology

#### StyleGuide
This is the complete overview of a style such as **Harvard**

#### Source Type
These are the types of things that can be referenced such as **book**.

#### Style
This is the format for a given reference. There is usually at
least one for every _Source Type_ but generally speaking there
are several different ways to format a book. This is
because the specifications may change which fields are required in given
circumstances such as a translated book, where the translator may be required.

#### Trait
This is a specific piece of information or field that the user might
need to fill in, such as **Author**, **Title**, etc. There
will be many traits specified as part of a style.

#### Trait Type
This is all about the type of data being entered. You might
have things like Strings, Dates and numbers but there are
also things like Contributors. Each have their own settings
so data can be manipulated. A title is a string and an author
will be set as a contributor.
