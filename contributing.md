# Contributions Guide #

## Style Guide ##
  > For our style guide, be sure to use the Hack Reactor style guide, defined in the student wiki.  
    Link: https://github.com/remotebeta/student-wiki/wiki/Style-Guide

## Branch Naming Syntax ##
  > issue-456

## Commit Message Syntax ##
  > Make sure commits are for one small issue/fix  
    Before you merge with your own master, all your commits should be squashed. (ideally)  
    On the final commit for an issue, use present tense, "closes issue-456" (issue 456)

## Pull Request Message Syntax ##
  > Title = issue-155 title of issue  (issue-155 refers to issue 155)
    Message = brief statement regarding what was changed.

# Standard git workflow
1. Pull upstream branch
```sh
git pull --rebase upstream master
```
2. Create a branch on your local machine
```sh
git checkout -b <branch_name>
```

3. Squash all the commits when done
```sh
git rebase -i HEAD~4
git rebase -i 32FFA1 # all comits AFTER selected
```
Inside editor, change all `pick`s to `fixup` except first. Change name of that one squashed commit to `closes #X` with command
```sh
git commit --amend
```

4. Push branch to your fork
```sh
git push origin <branch_name>
```

5. Submit pull request.
Organization name / master (BASE)
Your name / branch (TARGET)

6. Sync with organization master branch before working on new issue

```sh
git pull --rebase upstream master
git branch -d <branch_name> # deletes only if merged
```