---
title: "Motion with Editorial Purpose: Animation as Narrative, Not Decoration"
date: "2024-02-14"
excerpt: "The question to ask of every animated element is not 'does this look good?' but 'what does this teach the viewer about the content?' Motion that cannot answer this question is motion that should not exist."
tags: ["motion", "animation", "editorial"]
readingTime: 7
---

There is an experiment I run with junior designers working on motion projects for the first time. I ask them to describe, in words, what a particular animated element communicates — not what it depicts, but what it *says*. What does the viewer learn from watching this transition? What does this reveal about the content that could not have been revealed through static design?

Most of them cannot answer immediately. They describe the animation's appearance — it slides in from the left, it fades up, it scales from 80% to 100% — but they struggle to describe its communicative function. This is the fundamental problem with most animation in contemporary design: it has been designed to appear, not to communicate.

## The Animation Instinct

Motion in digital design has been cheapened by abundance. Tools that generate smooth animation with minimal effort have made animation available to every designer regardless of their understanding of motion principles. The result is a digital environment saturated with animation — looping backgrounds, parallax effects, hover states, loading states, transition effects — in which almost none of the motion carries genuine communicative content.

This is not an argument against animation. It is an argument for the editorial application of animation: for using motion only when motion uniquely serves the communication, and using it with the craft intelligence that its temporal and spatial complexity demands.

The editorial question is always: *what does this motion tell the viewer that stillness cannot?*

## Motion as Cognitive Aid

The most defensible use of animation is as cognitive support: motion that helps the viewer understand a spatial or temporal relationship that would be unclear in static form. When a user navigates between two states in an interface, animation that shows the spatial relationship between those states — by sliding from right to left when moving forward in a sequence, from left to right when moving back — is genuinely communicative. It orients the user in a conceptual space.

Similarly, animation that reveals the construction of a complex diagram — building it element by element in the sequence in which its components were designed or in which they should be understood — provides information that a static image of the complete diagram cannot. The sequence of construction is itself content.

These uses of animation are directly analogous to the editor's use of narrative sequencing in text: the order in which information is revealed is as important as the information itself.

## Motion as Emotional Register

Beyond cognitive function, animation can establish emotional register in a way that is genuinely distinct from static design. The speed, easing, and character of motion carries emotional meaning as directly as color or typeface.

Fast, high-energy animation with sharp easing communicates urgency, excitement, novelty. Slow, measured animation with gentle easing communicates calm, confidence, depth. The motion of a luxury brand should feel different from the motion of a news organization, which should feel different from the motion of a children's educational platform — not because of any arbitrary convention, but because each brand's relationship to time and attention is different.

This is the motion equivalent of typographic voice: the right temporal character makes the brand feel coherent and intentional, even if the viewer cannot articulate why. The wrong temporal character creates a persistent, low-level sense of wrongness — the visual equivalent of hearing a speaker use the wrong register for their content.

## The Easing Problem

Easing is the least discussed and most consequential variable in motion design. Easing is the acceleration curve of an animation: the way it speeds up and slows down across its duration. An animation that moves at constant speed from start to finish feels mechanical and wrong — nothing in the natural world moves that way. An animation with thoughtful easing feels alive, physical, real.

The specific easing used should be selected for its communicative content. An element that should feel like it's landing — arriving with weight and permanence — needs a different easing than one that should feel like it's floating into view. An element that should feel as if it's being revealed needs a different easing than one that should feel as if it's departing.

Most design tools provide a small set of standard easing presets. The temptation is to use these defaults without scrutiny. The editorial approach is to treat easing as a design decision as significant as color or size, and to make it consciously rather than by default.

## Duration and Patience

One of the most common failures in animation design is duration: animations that are too long. An animation that takes 800 milliseconds to complete is an animation that has asked the viewer to wait 800 milliseconds. In an interaction context, this is an eternity. The viewer's sense of the interface as responsive and alive is directly related to the speed of feedback.

But duration is contextual. An animation that would be intolerably long in a transactional interface context may be entirely appropriate in a narrative context — a brand film, a digital editorial feature, an immersive experience — where the viewer has consented to an extended temporal engagement. The same motion, in different contexts, is fast or slow, acceptable or obtrusive.

The editorial judgment required is an understanding of the implicit time contract between the design and its audience. What kind of attention has the viewer brought? What kind of pace have they consented to? Animation that exceeds this implicit contract — however beautiful — is animation that has lost its audience.

## Respecting Reduced Motion

No discussion of editorial animation would be complete without addressing the viewers for whom animation is not a design choice but a medical concern. Vestibular disorders, epilepsy, and attention-related conditions affect a significant portion of the population, for whom many standard animation effects cause discomfort, nausea, or serious adverse response.

The prefers-reduced-motion media query exists specifically to address this. It is not an optional accessibility feature. It is a fundamental commitment to the principle that design should not harm its audience. Every animation effect should have a reduced-motion alternative — typically a simple fade or no animation at all.

This constraint, like most design constraints, is also an opportunity. Designing for reduced motion requires identifying which of an animation's communicative functions are carried by motion alone and which could be communicated through other means. Often, this analysis reveals that the animation was doing more decorative than communicative work — and the reduced-motion version is, in fact, the better design.
